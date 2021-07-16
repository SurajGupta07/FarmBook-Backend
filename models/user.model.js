const mongoose = require("mongoose");
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: [true, 'Please enter your email id'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
   },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Passwords must have atleast 6 characters in length']
  }
})

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;