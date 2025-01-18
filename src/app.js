const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  const userData = {
    firstName: "Ram",
    lastName: "chandra",
    emailId: "ram@gmail.com",
    password: "password",
    gender: "male",
    phone: "8978789",
  };
  const user = new User(userData);
  try {
    await user.save();
    res.send("data saved successfully!!!");
  } catch (err) {
    console.error("error occured");
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
