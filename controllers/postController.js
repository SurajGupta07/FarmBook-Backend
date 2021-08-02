const { Post, UsersPost } = require("../models/post.model")

var getArrayOfUniqueIds = (arr, id) => {
  if (arr.some(val => val.toString() === id)) {
    return arr;
  }
  return arr.concat(id)
}

const creatNewPost = async (req, res, next) => {
    try{
      const { post } = req.body;
      let newPost = new Post(post);
      newPost = await newPost.save();
      let user = await UsersPost.findById(req.userId);
      if (user) {
        user = _.extend(user, { postList: getArrayOfUniqueIds(user.postList, newPost._id) }); 
      }
      else {
        user = new UsersPost({ _id: req.userId, postList: [newPost._id] }) 
      }
      newPost = await newPost.populate({
        path: "owner",
        select: "_id name username profileURL"
      }).execPopulate();

      return res.json({newPost})
    }
    catch(err) {
      console.log(err)
    }
}

const getAllUserPosts = async (req, res, next) => {
    try{
      const id = req.userId;
      const postList = await Post.find({ owner: id });
      return res.json({success: true, postList})
    } 
    catch(err) {
      console.log(err)
    }
}

module.exports = { creatNewPost, getAllUserPosts }