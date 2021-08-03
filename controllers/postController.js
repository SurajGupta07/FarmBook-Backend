const _ = require("lodash");
const {
    Post,
    UserPost
} = require("../models/post.model")
const {
    Notification,
    UserNotification
} = require("../models/notification.model")
const {
    getArrayOfUniqueIds
} = require('../utils')

const createNewPost = async (req, res) => {
    try {
        const {
            post
        } = req.body;
        let newPost = new Post(post);
        newPost = await newPost.save();
        let user = await UserPost.findById(req.userId);
        if (user) {
            user = _.extend(user, {
                postList: getArrayOfUniqueIds(user.postList, newPost._id)
            });
            await user.save();
        } else {
            user = new UserPost({
                _id: req.userId,
                postList: [newPost._id]
            })
            await user.save();
        }
        newPost = await newPost.populate({
            path: "author",
            select: "_id name username profileURL"
        }).execPopulate();

        return res.json({
            success: true,
            newPost
        })
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: 'Unable to create new post'
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const id = req.userId;
        const postList = await Post.find({
            author: id
        });
        return res.json({
            success: true,
            postList
        })
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: 'Unable to fetch posts'
        })
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
        const {
            id
        } = req.params;
        let post = await Post.findById(id);
        post = _.extend(post, {
            likedBy: getArrayOfUniqueIds(post.likedBy, req.userId)
        });
        post = await post.save();

        const isAlreadyLiked = await Notification.exists({
            action: "LIKED",
            postId: post._id,
            actionCreatorId: req.userId
        });

        if (!isAlreadyLiked) {
            let notification = new Notification({
                userId: post.author,
                action: "LIKED",
                actionCreatorId: req.userId,
                postId: post._id,
                username: "",
                isRead: false
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
            likedBy: post.likedBy,
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