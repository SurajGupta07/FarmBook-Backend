const { Router } = require('express');
const router = Router();
const { requireAuth } = require('../middlewares/auth-middleware.js');
const authController = require("../controllers/authController");

let {
  signupAndSendUserData,
  loginAndSendUserData,
  getLoggedInUserData,
  getUserData,
  updateUserData,
  getUsersNetwork,
  getFollowSuggestions
} = authController;

router.route('/signup')
  .post(signupAndSendUserData);

router.route('/login')
  .post(loginAndSendUserData);

router.route('/')
  .get(requireAuth, getLoggedInUserData);

router.route('/:username')
  .get(getUserData)

router.route("/update")
  .post(requireAuth, updateUserData)

router.route("/network/:username")
  .get(requireAuth, getUsersNetwork)

router.route("/getall")
  .get(getFollowSuggestions)

module.exports = router;