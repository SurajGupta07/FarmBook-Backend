const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  sender:{ 
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required:true
    },
  reciever: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true
  },
  action:{
    type:String,
    required:true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Post"
  }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
    Notification
}