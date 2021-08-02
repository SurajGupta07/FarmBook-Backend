const _ = require('lodash');
const User = require('../models/user.model.js');
const mySecret = process.env['secret']
const jwt = require('jsonwebtoken');

//Handle Errors

const handleErrors = (err) => {
  let errors = {email: '', password: ''}

  if(err.code === 11000) {
    errors.email = 'Email already exists'
    return errors;
  }

  if(err.message.includes('User validation failed')){
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message; 
    })
  }
  return errors;
}

const catchError = async (next, callback) => {
  try {
    await callback();
  }
  catch (err) {
    next(err);
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, mySecret, { expiresIn: "24h" })
}

module.exports.signupAndSendUserData = async (req, res) => {
  let { user } = req.body;
  try{
    const userData = await User.create( user )
    const token = createToken(userData._id)
    res.status(201).json({userData, token})
  }
  catch(err) {
    console.log(err)
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
}

module.exports.loginAndSendUserData = async (req, res) => {
 let { email, password } = req.body;
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id);
    res.status(201).json({user, token})
  }
  catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.getLoggedInUserData = async (req, res, next) => {
    try{
    const user = await User.findById(req.userId);
    if (user) {
      return res.json({
        user: _.pick(user, ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
      });
    }
    }
    catch(err){
    console.log(err)
    return res.json({
      success: false,
      message: "User not found!"
    });
    }
}

module.exports.getUserData = async (req, res, next) => {
  catchError(next, async () => {
    const { userId } = req.params;
    const user = await User.find({ userId });
    if (user) {
      return res.json({
        user: _.pick(user[0], ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
      });
    }
    return res.json({
      success: false,
      message: "User not found!"
    });
  });
}

module.exports.updateUserData = async (req, res, next) => {
  catchError(next, async () => {
    const { username, bio, profileURL } = req.params;
    let user = await User.find({ username, bio, profileURL });
    if (user) {
      user = _.extend(user, {username});
      user = _.extend(user, { bio });
      user = _.extend(user, { profileURL });
      user = await user.save();
      return res.json({
        user: _.pick(user, ["_id", "username", "bio", "profileURL"])
      });
    }
    return res.json({
      success: false,
      message: "User not found!"
    });
  });
}


module.exports.userNetwork = async (req, res, next) => {
  catchError(next, async () => {
    const {username} = req.params;
    let user = await User.find({ username }).populate({
      path: "followingList",
      select: "_id name email username bio profileURL"
    }).populate({
      path: "followersList",
      select: "_id name email username bio profileURL"
    })
    if(user) {
      return res.json({
        user: _.pick(user[0], ["followingList", "followersList", "name", "_id", "username", "profileURL"])
      })
    }
    return res.json({ message: "User not found!" });
  })
}

module.exports.getFollowSuggestions = (async (req, res, next) => {
   try{
    const users = await User.find()
    res.json({users})
  } catch ( err ){
    res.status(500).json({success: false, message: "Unable to get products", errorMessage: err.message})
  }
})