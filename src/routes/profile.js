const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const {
  validateEditFields,
  validateNewPassword,
} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    const age = user.getAge();
    res.json({ user, age });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    validateEditFields(req);
    const user = req.user;
    const allowedUpdate = [
      "firstName",
      "lastName",
      "age",
      "about",
      "photoURL",
      "skills",
      "gender",
      "dob",
    ];
    const parsedDob = new Date(user.dob);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).send("Invalid date format. Use YYYY-MM-DD.");
    }
    const receivedFields = Object.keys(req.body);
    const invalidFields = receivedFields.filter(
      (field) => !allowedUpdate.includes(field)
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .send(`can't update Fields ${invalidFields.join(" ")}`);
    }

    receivedFields.forEach((k) => (user[k] = req.body[k]));
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const user = req.user;

    validateNewPassword(req);
    const currentPassword = req.body.currentPassword;
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("incorrect current password");
    }
    if (currentPassword === req.body.newPassword) {
      throw new Error("new password can't be same a old password");
    }
    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    await User.findByIdAndUpdate({ _id: user.id }, { password: passwordHash });
    res.cookie("token", null, { maxAge: 0 });
    res.send(" Password Updated successfully, and loggedout");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
