const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const status = req.params.status;

      const toUserId = req.params.toUserId;

      const fromUserId = req.user._id;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status ");
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }

      const existingUsers = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingUsers) {
        return res.send("connection request already sent");
      }

      const user = req.user;
      const connectionRequestData = new ConnectionRequest({
        fromUserId: user._id,
        toUserId: toUserId,
        status: status,
      });
      await connectionRequestData.save();
      if (status === "interested") {
        return res.json({
          message: `you are ${status} in ${toUser.firstName} ${toUser.lastName}`,
        });
      } else {
        return res.json({
          message: `you ${status} ${toUser.firstName} ${toUser.lastName}`,
        });
      }
    } catch (err) {
      return res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "status not allowed" });
    }
    const connectionRequestData = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequestData) {
      return res.status(404).send("Connection request can't find");
    }
    connectionRequestData.status = status;
    const data = await connectionRequestData.save();
    res.json({
      message: `connection request is ${status}`,
      data: connectionRequestData,
    });
  }
);

module.exports = requestRouter;
