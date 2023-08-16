const mongoose = require('mongoose');

const secret = "mongodb+srv://suraj:surajneog@cluster0.tgqgv.mongodb.net/farmBook";

const connectDB = () => {

  mongoose.connect(secret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // suppress 'collection.ensureIndex is deprecated' warning
      useCreateIndex: true
    })
    .then(() => console.log("Successfully connected to 'FarmBook' DB."))
    .catch(err => console.log(err));
}

module.exports = connectDB;