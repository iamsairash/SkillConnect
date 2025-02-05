const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");
const validator = require("validator");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/sendconnection", authUser, async (req, res) => {
  try {
    const user = req.user;

    res.send(
      user.firstName + " " + user.lastName + " send the connection request"
    );
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("invalid credentials"); // not registered user vandaa aru lai tha hunx ki yo email hamro db ma xaina (yo pani euta info ho jun leak hunu hudaina)
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);

      res.send("loging successful!!");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/signup", async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("successfully connected to database");
    app.listen("7777", () => {
      console.log("listening at port 7777");
    });
  })
  .catch((err) => {
    console.error("cann't connect to db");
  });
