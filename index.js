const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(cors());

const connectDB = require('./db/db.connect');
const authRouter = require('./routes/authRoute');
const postRouter = require('./routes/postRoute');
const notificationRouter = require("./routes/notificationRoute");
const feedRouter = require("./routes/feedRoute");

app.use(bodyParser.json());

const PORT = 3000;

connectDB();

//Routes
app.use("/user", authRouter);
app.use("/post", postRouter);
app.use("/notification", notificationRouter);
app.use("/feed", feedRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "FarmBook Backend"
  });
});

app.listen(PORT, () => {
  console.log('Server started');
});