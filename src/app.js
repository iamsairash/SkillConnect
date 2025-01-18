const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body); // the req.body refer to the data in the postman that we write in body in json format (or other format maybe)

  const user = new User(req.body); // creating instance of User model
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
