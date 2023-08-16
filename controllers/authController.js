const _ = require("lodash");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { handleErrors, createToken } = require("../utils");

module.exports.signupAndSendUserData = async (req, res) => {
  let { user } = req.body;
  try {
    const userData = await User.create(user);
    const token = createToken(userData._id);
    res.status(201).json({
      userData,
      token,
    });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

module.exports.loginAndSendUserData = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(201).json({
      user,
      token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

module.exports.getLoggedInUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const token = createToken(user._id);
    if (user) {
      return res.json({
        success: true,
        token,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports.getUserData = async (req, res) => {
  try {
    const { username } = req.params;
    const userDetails = await User.findOne({ username });
    res.status(200).json({ success: true, userDetails });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports.updateUserData = async (req, res, next) => {
  try {
    const { bio, profileURL } = req.body;
    var user = User.findById(req.userId);
    if (user) {
      user = _.extend(user, {
        bio,
      });
      user = _.extend(user, {
        profileURL,
      });
      // user = await user.save();
      return res.json({
        success: true,
        user: _.pick(user, ["_id", "bio", "profileURL"]),
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports.getUsersNetwork = async (req, res, next) => {
  try {
    const { username } = req.params;
    let user = await User.find({
      username,
    })
      .populate({
        path: "followingList",
        select: "_id name email username bio profileURL",
      })
      .populate({
        path: "followersList",
        select: "_id name email username bio profileURL",
      });
    if (user) {
      return res.json({
        success: true,
        user: _.pick(user[0], [
          "followingList",
          "followersList",
          "name",
          "_id",
          "username",
          "profileURL",
        ]),
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports.getFollowSuggestions = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({
        createdAt: "desc",
      })
      .limit(5);
    res.json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get products",
      errorMessage: err.message,
    });
  }
};

module.exports.addNewFollowing = async (req, res, next) => {
  try {
    const { userId, followUserId } = req.body;
    const mainUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { followingList: followUserId },
      },
      { new: true }
    );
    const followUser = await User.findByIdAndUpdate(
      followUserId,
      {
        $push: { followersList: userId },
      },
      { new: true }
    );
    res.status(200).json({ success: true, mainUser, followUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

module.exports.removeFollowing = async (req, res, next) => {
  try {
    const { userId, followUserId } = req.body;
    console.log(userId, followUserId);
    const mainUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followingList: followUserId },
      },
      { new: true }
    );
    const followUser = await User.findByIdAndUpdate(
      followUserId,
      {
        $pull: { followersList: userId },
      },
      { new: true }
    );
    res.status(200).json({ success: true, mainUser, followUser });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "User not found!",
    });
  }
};
