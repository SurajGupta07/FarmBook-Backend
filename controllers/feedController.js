const mongoose = require("mongoose");
const { User } = require("../models/user.model.js")
const { Post } = require("../models/post.model.js")

const LIMIT = 3;

// const getFeed = async (req, res, next) => {
//     try{
//       const user = await User.findById(req.userId);
//       console.log('user har', user)
//       let userIdList = [user._id].concat(user.followingList);
//       userIdList = userIdList.map(id => mongoose.Types.ObjectId(id));
//       console.log(userIdList, 'userIdList')

//       let postList = await Post.find({
//           'owner': {
//             $in: userIdList
//           }
//         }).sort({ createdAt: 'desc' }).limit(LIMIT).populate({
//           path: "owner",
//           select: "_id name username profileURL"
//         }).exec()

//       console.log('post list', postList)
//       res.json({ message:'Post list', postList})
//     }
//     catch(err) {
//       console.log(err)
//     }

// }

const getFeed = async (req, res, next) => {
  try {
    const id = req.userId;
    console.log(id)
    const postList = await Post.find({ owner: id });
    return res.json({
      success: true,
      postList
    })
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = { getFeed }