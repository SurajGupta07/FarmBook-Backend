const {
    UserNotification
} = require("../models/notification.model");

const getNotifications = async (req, res) => {
    try {
    const notificationList = await Notification.find({ reciever: req.userId })
      .populate({ path: "sender ", select: "username name profileURL" })
      .populate({ path: "postId", select: "content" });

    res.status(200).json({ success: true, notificationList });
  } catch (error) {
    console.error(log);
    res.status(500).json({ success: false, error});
  }
}

module.exports = {
    getNotifications
}