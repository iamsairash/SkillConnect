const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true, maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ fromUserId: 1, toUserId: 1 }); // For faster queries

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
