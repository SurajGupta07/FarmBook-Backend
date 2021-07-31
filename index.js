const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(cors());

const connectDB = require('./db/db.connect');
const authRouter = require('./routes/authRoute.js');
const postRouter = require('./routes/postRoute.js');

app.use(bodyParser.json());

const PORT = 3000;

connectDB();

//Routes
app.use(authRouter);
app.use("/post", postRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "FarmBook Backend"
  });
});


app.listen(PORT, () => {
  console.log('Server started');
});
