const express = require("express");
const router = express.Router();
const { creatNewPost, getAllUserPosts } = require("../controllers/postController.js")

router.route("/")
  .post(creatNewPost)

router.route("/getall")
  .get(getAllUserPosts)

module.exports = router;