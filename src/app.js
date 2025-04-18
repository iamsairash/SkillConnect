const express = require("express");
const { connectDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./models/message.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const messageRouter = require("./routes/messages.js");
const { createServer } = require("node:http");
const cors = require("cors");
const initializeSocket = require("./utils/socket.js");

const app = express();

const PORT = process.env.PORT || 7777;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const server = createServer(app);
initializeSocket(server);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", messageRouter);

connectDB()
  .then(() => {
    console.log("successfully connected to database");
    server.listen(PORT, () => {
      console.log("listening at port " + PORT);
    });
  })
  .catch((err) => {
    console.error("cann't connect to db");
  });
