const {
  Router
} = require('express');
const router = Router();
const {
  requireAuth
} = require('../middlewares/auth-middleware.js');
const authController = require("../controllers/authController");

let {
  signupAndSendUserData,
  loginAndSendUserData,
  getLoggedInUserData,
  getUserData,
  updateUserData,
  getUsersNetwork,
  getFollowSuggestions,
  addNewFollowing,
  removeFollowing
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
  .get(requireAuth, getFollowSuggestions)

router.route("/follow")
  .post(requireAuth, addNewFollowing)

router.route("/follow")
  .post(requireAuth, removeFollowing)

module.exports = router;