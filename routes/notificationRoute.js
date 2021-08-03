const express = require("express");
const router = express.Router();
const {
  getNotifications
} = require("../controllers/notificationController");
const {
  requireAuth
} = require("../middlewares/auth-middleware");

router.route("/")
  .get(requireAuth, getNotifications)

module.exports = router;