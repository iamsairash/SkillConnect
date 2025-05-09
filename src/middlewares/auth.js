const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("please login ....");
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  authUser,
};
