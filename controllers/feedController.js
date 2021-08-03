const mongoose = require('mongoose');
const {
    User
} = require('../models/user.model');
const {
    Post
} = require('../models/post.model');

const LIMIT = 5;

const getFeed = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        let userIdList = [user._id].concat(user.followingList);
        userIdList = userIdList.map(id => mongoose.Types.ObjectId(id));

        let postList = await Post.find({
            'author': {
                $in: userIdList
            }
        }).sort({
            createdAt: 'desc'
        }).limit(LIMIT).populate({
            path: "author",
            select: "_id name username profileURL"
        }).exec()

        res.json({
            success: true,
            postList,
        })
    } catch (err) {
        res.json({
            success: false,
            message: 'Not able to fetch feed'
        })
    }
}

module.exports = {
    getFeed
}