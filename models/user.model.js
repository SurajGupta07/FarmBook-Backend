const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true
   },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;