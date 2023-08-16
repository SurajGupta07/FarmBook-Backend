const mongoose = require("mongoose");
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");

const LIMIT = 20;

const getFeed = async (req, res) => {
  try {
    let _id = req.userId;
    const followingUsers = await User.findById({ _id }).exec();

    const response = await Post.find({
      userId: { $in: [...followingUsers.followingList, _id] },
    })
      .populate({
        path: "userId",
        select: "name username bio profileURL",
      })
      .sort("-createdAt")
      .limit(LIMIT);

    res.status(200).json({ success: true, postList: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

module.exports = {
  getFeed,
};
