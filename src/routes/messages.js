const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const Message = require("../models/message.js");
const messageRouter = express.Router();

const checkConnection = async (req, res, next) => {
  const fromUserId = req.user._id;
  const toUserId = req.body.toUserId || req.params.userId;
  const connection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId, status: "accepted" },
      { fromUserId: toUserId, toUserId: fromUserId, status: "accepted" },
    ],
  });
  if (!connection) return res.status(403).send("Not connected to this user");
  req.toUserId = toUserId;
  next();
};

messageRouter.post(
  "/messages/send",
  authUser,
  checkConnection,
  async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || !text.trim()) throw new Error("Text is required");
      const message = new Message({
        fromUserId: req.user._id,
        toUserId: req.toUserId,
        text,
      });
      await message.save();
      res.json({ message: "Sent successfully", data: message });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

messageRouter.get(
  "/messages/:userId",
  authUser,
  checkConnection,
  async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { fromUserId: req.user._id, toUserId: req.toUserId },
          { fromUserId: req.toUserId, toUserId: req.user._id },
        ],
      }).sort({ createdAt: 1 });
      res.json({ messages });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = messageRouter;
