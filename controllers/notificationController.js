const {
    UserNotification
} = require("../models/notification.model");

const getNotifications = async (req, res) => {
    try {
        const notificationList = await UserNotification.findById(req.userId).populate({
            path: "notificationList",
            populate: {
                path: "actionCreatorId",
                select: "_id name username"
            }
        });

        res.json({
            success: true,
            notificationList
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getNotifications
}