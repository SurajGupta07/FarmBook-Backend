const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  },
  content: {
    type: String,
    trim: true,
    maxLen: 200,
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reactions: {
    happy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    angry: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
}, { timestamps: true })

const Post = mongoose.model("Post", PostSchema);

const UserPostSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
});

const UsersPost = mongoose.model("UsersPost", UserPostSchema);

module.exports = { Post, UsersPost }