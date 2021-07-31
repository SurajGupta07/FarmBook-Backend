const { Router } = require('express');
const router = Router();
// const { requireAuth } = require('../middlewares/auth-middleware.js')

const authController = require("../controllers/authController");
let { signupAndSendUserData, loginAndSendUserData, getLoggedInUserData, getUserData, updateUserData, userNetwork, getFollowSuggestions } = authController;

router.route('/follow-users')
  .get(getFollowSuggestions)

router.route('/signup')
  .post(signupAndSendUserData);

router.route('/login')
  .post(loginAndSendUserData);

router.route('/')
  .get(getLoggedInUserData);

router.route("/:username")
  .get(getUserData);

router.route('/:username/update')
  .post(updateUserData)

router.route('/network/:username')
  .get(userNetwork)

module.exports = router;