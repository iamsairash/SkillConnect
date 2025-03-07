const Message = require("../models/message");
const { Server } = require("socket.io");
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, loggedInUser }) => {
      const roomId = [userId, loggedInUser].sort().join("_");
      socket.join(roomId);
      //   console.log(firstName + " joins " + roomId);
    });

    socket.on(
      "sendMessage",
      async ({ loggedInUser, userId, firstName, text }) => {
        try {
          // Save message in MongoDB
          const message = new Message({
            fromUserId: loggedInUser,
            toUserId: userId,
            text,
          });
          await message.save();

          const roomId = [loggedInUser, userId].sort().join("_");
          io.to(roomId).emit("receivedMessage", { firstName, text });

          console.log("Message sent and saved:", text);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
