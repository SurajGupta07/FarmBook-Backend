const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
        type: String,
        trim: true,
        maxLen: 200
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = { Post }