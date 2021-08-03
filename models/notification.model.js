const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        trim: true,
        enum: ['LIKED', 'FOLLOWED', 'REACTED'],
        required: true
    },
    actionCreatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    username: {
        type: String,
        trim: true,
    },
    hasSeen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

const userNotificationSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notificationList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
});

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

module.exports = {
    Notification,
    UserNotification
}