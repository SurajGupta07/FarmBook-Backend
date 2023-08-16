const {
    Router
} = require('express');
const router = Router();
const {
    requireAuth
} = require('../middlewares/auth-middleware');
const {
    createNewPost,
    getAllPosts,
    deletePost,
    likeUserPost,
    unlikeUserPost
} = require("../controllers/postController");

router.route("/userpost/:username")
  .get(requireAuth, getAllPosts)

router.route("/")
  .post(createNewPost)

router.route("/:id")
  .delete(requireAuth, deletePost)

router.route("/like/:postId")
  .put(likeUserPost)

router.route("/unlike/:postId")
  .post(unlikeUserPost)

module.exports = router;