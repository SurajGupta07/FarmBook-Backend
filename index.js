const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(cors());

const connectDB = require('./db/db.connect');
const authRouter = require('./routes/authRoute.js');
const postRouter = require('./routes/postRoute.js');
const feedRouter = require('./routes/feedRoute.js');

app.use(bodyParser.json());

const PORT = 3000;

connectDB();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "FarmBook Backend"
  });
});

//Routes
app.use("/feed", feedRouter);
app.use(authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log('Server started');
});
