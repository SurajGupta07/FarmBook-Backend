const express = require("express");
const router = express.Router();

const { getFeed } = require("../controllers/feedController.js")

router.route("/")
  .get(getFeed)

module.exports = router;