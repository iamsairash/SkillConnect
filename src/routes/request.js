const express = require("express");
const { authUser } = require("../middlewares/auth.js");

const requestRouter = express.Router();

requestRouter.post("/sendconnection", authUser, async (req, res) => {
  try {
    const user = req.user;

    res.send(
      user.firstName + " " + user.lastName + " send the connection request"
    );
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
