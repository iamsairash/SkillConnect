const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender skills about";

userRouter.get("/user/request/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender skills about");

    if (connectionRequest.length < 1) {
      return res.send("no connection requests");
    }

    return res.json({
      message: "connection requests: ",
      data: connectionRequest,
    });
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      return row.fromUserId.equals(loggedInUser._id)
        ? row.toUserId
        : row.fromUserId;
    });

    res.json({ message: "this are connections", data });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

userRouter.get("/user/feed/", authUser, async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInsUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInsUser._id }, { toUserId: loggedInsUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserFromFeed.add(req.fromUserId.toString());
      hiddenUserFromFeed.add(req.toUserId.toString());
    });
    console.log(hiddenUserFromFeed);

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hiddenUserFromFeed) },
        },
        { _id: { $ne: loggedInsUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
