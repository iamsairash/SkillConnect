const express = require("express");
const User = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, { maxAge: 680_400_000 });

      res.json({ user });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, gender, dob } = req.body;

    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const userdata = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      dob,
    }); // creating instance of User model
    const user = await userdata.save();
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 680_400_000 });
    res.send("data saved successfully!!!");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { maxAge: 0 });
  res.send("logout successful");
});

module.exports = authRouter;
