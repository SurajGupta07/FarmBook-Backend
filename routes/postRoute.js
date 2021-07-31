const express = require("express");
const router = express.Router();
const { creatNewPost } = require("../controllers/postController.js")

router.route("/")
  .post(creatNewPost)

module.exports = router;