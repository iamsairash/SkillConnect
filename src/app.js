const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");
const validator = require("validator");

const app = express();

app.use(express.json());

app.get("/user_id", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send("something went wrong ");
  }
});

app.get("/oneuser", async (req, res) => {
  const user = await User.findOne({ firstName: "Sairash" });
  res.status(200).send(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find({ emailId: "pushpa@gmail.com" });
  res.send(users);
});

app.patch("/user/:userid", async (req, res) => {
  const userid = req.params?.userid;
  const data = req.body;

  try {
    const UPDATE_ALLOWED = [
      "name",
      "password",
      "age",
      "gender",
      "skills",
      "about",
      "photoURL",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      UPDATE_ALLOWED.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data?.age !== undefined) {
      if (typeof data?.age != "number" || data?.age < 12 || data?.age > 100) {
        throw new Error("age should be between 12 and 100");
      }
    }
    if (data.photoURL && !validator.isURL(data.photoURL)) {
      throw new Error("URL is not valid: ");
    }

    await User.findByIdAndUpdate({ _id: userid }, data, {
      runValidators: true,
    });
    res.send("data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

app.patch("/usere", async (req, res) => {
  const email = req.body.email;
  try {
    await User.findOneAndUpdate({ emailId: email }, { emailId: "bholenath" });
    res.status(200).send("Data updated successfully !!!");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find(); // finds all the documents from db
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.delete("/deleteuser", async (req, res) => {
  const userid = req.body.id;
  try {
    await User.findByIdAndDelete(userid);
    res.send("user delelted successfully");
  } catch (err) {
    res.send("something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  // console.log(req.body); // the req.body refer to the data in the postman that we write in body in json format (or other format maybe)

  const user = new User(req.body); // creating instance of User model
  try {
    if (user?.skills.length > 10) {
      throw new Error("Skills can't be more than 10");
    }

    if (typeof user?.age != "number" || user?.age > 100 || user?.age < 12) {
      throw new Error("Age should be between 12 and 100");
    }

    if (!validator.isEmail(user.emailId)) {
      throw new Error("Email is not valid: ");
    }
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
