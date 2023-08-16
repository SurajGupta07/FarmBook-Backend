const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectDB = require("./db/db.connect");
const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const notificationRouter = require("./routes/notificationRoute");
const feedRouter = require("./routes/feedRoute");

connectDB();

// Routes
app.use("/user", authRouter);
app.use("/post", postRouter);
app.use("/notification", notificationRouter);
app.use("/feed", feedRouter);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mock API Server is up and running at: http://localhost:${port}`);
});
