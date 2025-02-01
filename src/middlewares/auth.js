const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new Error("Invalid token");
  }
  const decodedMessage = jwt.verify(token, "TheSecret@123");
  const user = await User.findById(decodedMessage._id);
  if (!user) {
    throw new Error("User not found");
  }

  req.user = user;
  next();
};

module.exports = {
  authUser,
};
