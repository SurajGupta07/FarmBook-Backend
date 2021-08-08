const _ = require("lodash");
const {
    Post,
} = require("../models/post.model")
const {
    User,
} = require("../models/user.model")
const {
    Notification,
    UserNotification
} = require("../models/notification.model")
const {
    getArrayOfUniqueIds
} = require('../utils')

const createNewPost = async (req, res) => {
    try {
    const {post, userId} = req.body;

    const newPost = new Post({
      userId,
      content: post.content
    });

    await newPost.save();
    const postPopulated = await newPost
      .populate({
        path: "userId",
        select: "name username bio profileURL",
      })
      .execPopulate();

    res.status(200).json({ success: true, post: postPopulated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "add post error",
      errorMessage: error.message,
    });
  }
}

const getAllPosts = async (req, res) => {
    try {
      const {username} = req.params;
      const userId = await User.findOne({username}, '_id')
      const posts = await Post.find({userId})  
      res.json({
        success:true,
        posts
      })
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
}

const deletePost = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const post = await Post.findByIdAndDelete(id);
        return res.json({
            success: true,
            deletedPostId: post
        })
    } catch (err) {
        res.json({
            success: false,
            message: 'Unable to delete post'
        })
        console.log(err)
    }
}

const likeUserPost = async (req, res) => {
    try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    post.likedBy.push(req.userId);
    await post.save();
    res.status(200).json({ success: true, postId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
}

const reactToPost = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const type = req.query.type;
        let post = await Post.findById(id);
        const updateReactions = _.extend(post.reactions, {
            [type]: getArrayOfUniqueIds(post.reactions[type], req.userId)
        });
        post = _.extend(post, {
            reactions: updateReactions
        })
        post = await post.save();

        const isAlreadyReacted = await Notification.exists({
            action: "REACTED",
            postId: post._id,
            actionCreatorId: req.userId
        });

        if (!isAlreadyReacted) {
            let notification = new Notification({
                userId: post.author,
                action: "REACTED",
                actionCreatorId: req.userId,
                postId: post._id,
                username: "",
                hasSeen: false
            });
            notification = await notification.save();

            let userNotificationList = await UserNotification.findById(post.author);

            if (userNotificationList) {
                userNotificationList = _.extend(userNotificationList, {
                    notificationList: _.concat(userNotificationList.notificationList, notification._id)
                })
                await userNotificationList.save();
            } else {
                userNotificationList = new UserNotification({
                    _id: post.author,
                    notificationList: [notification._id]
                })
                await userNotificationList.save();
            }
        }

        return res.json({
            success: true,
            reactions: post.reactions,
            postId: id,
        })
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: 'Unable to create post'
        })
    }
}


module.exports = {
    createNewPost,
    getAllPosts,
    deletePost,
    likeUserPost,
    reactToPost
}