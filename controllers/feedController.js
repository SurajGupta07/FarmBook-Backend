const mongoose = require('mongoose');
const {
    User
} = require('../models/user.model');
const {
    Post
} = require('../models/post.model');

const LIMIT = 20;

const getFeed = async (req, res) => {
    try {
    const { userId } = req.userId;
    console.log(userId)
    const followingUsers = await User.findById(userId, "followingList").exec();

    const response = await Post.find({
      userId: { $in: [...followingUsers.followingList, userId] },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "name username bio profileURL",
      })
      .limit(LIMIT);

    res.status(200).json({ success: true, postList: response });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
}

module.exports = {
    getFeed
}