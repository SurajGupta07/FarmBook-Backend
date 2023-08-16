const _ = require("lodash");
const { User } = require("../models/user.model");
const { handleErrors, createToken } = require("../utils");

const handleError = (res, err, message = "User not found") => {
  console.error(err);
  res.json({
    success: false,
    message,
  });
};

const signupAndSendUserData = async (req, res) => {
  try {
    const { user } = req.body;
    const userData = await User.create(user);
    const token = createToken(userData._id);
    res.status(201).json({
      userData,
      token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

const loginAndSendUserData = async (req, res) => {
  try {
    const { email, password } = req.body;
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

const getLoggedInUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const token = createToken(user._id);
      return res.json({
        success: true,
        token,
      });
    }
    handleError(res, null);
  } catch (err) {
    handleError(res, err);
  }
};

const getUserData = async (req, res) => {
  try {
    const { username } = req.params;
    const userDetails = await User.findOne({ username });
    res.status(200).json({ success: true, userDetails });
  } catch (err) {
    handleError(res, err);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const { bio, profileURL } = req.body;
    let user = await User.findById(req.userId);
    if (user) {
      user = _.extend(user, { bio }, { profileURL });
      return res.json({
        success: true,
        user: _.pick(user, ["_id", "bio", "profileURL"]),
      });
    }
    next();
  } catch (err) {
    handleError(res, err);
  }
};

const getUsersNetwork = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate({
      path: "followingList followersList",
      select: "_id name email username bio profileURL",
    });
    if (user) {
      return res.json({
        success: true,
        user: _.pick(user, [
          "followingList",
          "followersList",
          "name",
          "_id",
          "username",
          "profileURL",
        ]),
      });
    }
    next();
  } catch (err) {
    handleError(res, err);
  }
};

const getFollowSuggestions = async (req, res) => {
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

const addNewFollowing = async (req, res, next) => {
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

const removeFollowing = async (req, res, next) => {
  try {
    const { userId, followUserId } = req.body;
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
    handleError(res, err, "User not found!");
  }
};

module.exports = {
  signupAndSendUserData,
  loginAndSendUserData,
  getLoggedInUserData,
  getUserData,
  updateUserData,
  getUsersNetwork,
  getFollowSuggestions,
  addNewFollowing,
  removeFollowing,
};
