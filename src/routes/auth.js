const express = require("express");
const User = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("invalid credentials"); // not registered user vandaa aru lai tha hunx ki yo email hamro db ma xaina (yo pani euta info ho jun leak hunu hudaina)
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {maxAge: 680_400_000, httpOnly: true});

      res.send("loging successful!!");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, gender } = req.body;
  try {
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
    }); // creating instance of User model
    await user.save();
    res.send("data saved successfully!!!");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

authRouter.post("/logout", async(req,res)=>{
  res.cookie("token", null, {maxAge: 0, httpOnly: true})
  res.send("logout successful")
})

module.exports = authRouter;
