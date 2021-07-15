const { Router } = require('express');
const authController = require("../controllers/authController");

const router = Router();
let { signup_get, signup_post, login_get, login_post } = authController;

router.get('/signup', signup_get);
router.post('/signup', signup_post);
router.get('/login', login_get);
router.post('/login', login_post);

module.exports = router;