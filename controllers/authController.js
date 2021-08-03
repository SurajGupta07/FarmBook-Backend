const _ = require('lodash');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const {
  handleErrors,
  createToken
} = require('../utils')

module.exports.signupAndSendUserData = async (req, res) => {
  let {
    user
  } = req.body;
  try {
    const userData = await User.create(user)
    const token = createToken(userData._id)
    res.status(201).json({
      userData,
      token
    })
  } catch (err) {
    console.log(err)
    const errors = handleErrors(err)
    res.status(400).json({
      errors
    })
  }
}

module.exports.loginAndSendUserData = async (req, res) => {
  let {
    email,
    password
  } = req.body;
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id);
    res.status(201).json({
      user,
      token
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({
      errors
    })
  }
}

module.exports.getLoggedInUserData = async (req, res) => {
  try {
    const user = await User.find(req.userId);
    if (user) {
      return res.json({
        success: true,
        user
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      success: false,
      message: 'User not found'
    })
  }
}

module.exports.getUserData = async (req, res) => {
  try {
    const {
      username
    } = req.params;
    const user = await User.find({
      username
    })
    if (user) {
      return res.json({
        success: true,
        user: _.pick(user[0], ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      success: false,
      message: 'User not found'
    })
  }
}

module.exports.updateUserData = async (req, res, next) => {
  try {
    const {
      bio,
      profileURL
    } = req.body;
    var user = User.findById(req.userId)
    if (user) {
      user = _.extend(user, {
        bio
      });
      user = _.extend(user, {
        profileURL
      });
      // user = await user.save();
      return res.json({
        success: true,
        user: _.pick(user, ["_id", "bio", "profileURL"])
      })
    }
    next();
  } catch (err) {
    console.log(err)
    res.json({
      success: false,
      message: 'User not found'
    })
  }
}

module.exports.getUsersNetwork = async (req, res, next) => {
  try {
    const {
      username
    } = req.params;
    let user = await User.find({
      username
    }).populate({
      path: "followingList",
      select: "_id name email username bio profileURL"
    }).populate({
      path: "followersList",
      select: "_id name email username bio profileURL"
    })
    if (user) {
      return res.json({
        success: true,
        user: _.pick(user[0], ["followingList", "followersList", "name", "_id", "username", "profileURL"])
      });
    }
  } catch (err) {
    console.log(err)
    res.json({
      success: false,
      message: 'User not found'
    })
  }
}

module.exports.getFollowSuggestions = (async (req, res) => {
  try {
    const users = await User.find({}).sort({
      createdAt: 'desc'
    }).limit(5)
    console.log(users)
    res.json({
      users
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get products",
      errorMessage: err.message
    })
  }
})

module.exports.addNewFollowing = async (req, res, next) => {
  try {
    const {
      userId
    } = req.body;
    console.log(userId)
    let followingUser = await User.findById(req.userId);
    console.log(followingUser, 'following User')
    if (followingUser) {
      followingUser = _.extend(followingUser, {
        followingList: _.union(followingUser.followingList, [userId])
      });
      await followingUser.save();

      let followedUser = await User.findById(userId);
      followedUser = _.extend(followedUser, {
        followersList: _.union(followedUser.followersList, [req.userId])
      });
      await followedUser.save();

      const isAlreadyFollowed = await Notification.exists({
        action: "FOLLOWED",
        actionCreatorId: req.userId
      });

      if (!isAlreadyFollowed) {
        let notification = new Notification({
          userId: followedUser._id,
          action: "FOLLOWED",
          actionCreatorId: req.userId,
          username: "",
          isRead: false
        });

        notification = await notification.save();

        let userNotificationList = await UserNotification.findById(followedUser._id);

        if (userNotificationList) {
          userNotificationList = _.extend(userNotificationList, {
            notificationList: _.concat(userNotificationList.notificationList, notification._id)
          })
          await userNotificationList.save();
        } else {
          userNotificationList = new UserNotification({
            _id: followedUser._id,
            notificationList: [notification._id]
          })
          await userNotificationList.save();
        }
      }

      return res.json({
        success: true,
        followedUserId: followedUser._id,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "User not found!"
    });
  }
}

module.exports.removeFollowing = async (req, res, next) => {
  try {
    const {
      userId
    } = req.body;
    let unFollowingUser = await User.findById(req.userId);
    if (unFollowingUser) {
      unFollowingUser = _.extend(unFollowingUser, {
        followingList: _.filter(unFollowingUser.followingList, (id) => id.toString() !== userId)
      });
      await unFollowingUser.save();

      let unFollowedUser = await User.findById(userId);
      unFollowedUser = _.extend(unFollowedUser, {
        followersList: _.filter(unFollowedUser.followersList, (id) => id.toString() !== req.userId)
      });
      await unFollowedUser.save();
      return res.json({
        success: true,
        unFollowedUserId: unFollowedUser._id
      });
    }
  } catch (err) {
    console.log(err)
    return res.json({
      success: false,
      message: "User not found!"
    });
  }
}