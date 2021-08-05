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
    reactToPost
} = require("../controllers/postController");

router.route("/user/:username")
    .get(requireAuth, getAllPosts)

router.route("/")
    .post(createNewPost)

router.route("/:id")
    .delete(requireAuth, deletePost)

router.route("/like/:id")
    .post(requireAuth, likeUserPost)

router.route("/react/:id")
    .post(requireAuth, reactToPost)

module.exports = router;