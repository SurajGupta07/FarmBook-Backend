const express = require("express");
const router = express.Router();
const {
    requireAuth
} = require("../middlewares/auth-middleware");

const {
    getFeed
} = require("../controllers/feedController");

router.route("/")
    .get(requireAuth, getFeed)

module.exports = router;