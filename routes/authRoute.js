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

router.route("/getall")
  .get(getFollowSuggestions)

router.route('/')
  .get(requireAuth, getLoggedInUserData);

router.route('/:username')
  .get(getUserData)

router.route("/update")
  .post(requireAuth, updateUserData)

router.route("/network/:username")
  .get(requireAuth, getUsersNetwork)

router.route("/follow/new") 
  .post(addNewFollowing)

router.route("/follow/remove")
  .post(removeFollowing)

module.exports = router;