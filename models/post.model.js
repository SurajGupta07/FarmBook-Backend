const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true,
        maxLen: 200
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reactions: {
        happy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        angry: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        sad: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

const userPostSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const UserPost = mongoose.model('UserPost', userPostSchema);

module.exports = {
    Post,
    UserPost
}