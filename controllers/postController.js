const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");

const createNewPost = async (req, res) => {
  try {
    const { post, userId } = req.body;
    const newPost = new Post({
      userId,
      content: post.content,
      postImage: post.imageURL,
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
};

const getAllPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const userId = await User.findOne({ username }, "_id");
    const posts = await Post.find({ userId }).sort("-createdAt");
    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    return res.json({
      success: true,
      deletedPostId: post,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Unable to delete post",
    });
    console.log(err);
  }
};

const likeUserPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likedBy: userId },
      },
      {
        new: true,
      }
    )
      .populate("likedBy", "username")
      .exec();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const unlikeUserPost = async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    post.likedBy.pull(userId);
    await post.save();
    res.status(200).json({ success: true, userId, post });
  } catch (err) {
    console.log({ err });
    res.json({ err });
  }
};

module.exports = {
  createNewPost,
  getAllPosts,
  deletePost,
  likeUserPost,
  unlikeUserPost,
};
