const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter vaild emails: ");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong passwrod: ");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    about: {
      type: String,
      default: "This is default about of user",
      maxLength: 100,
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid URL: ");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("can't include more than 10 skills");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "TheSecret@123");
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const passwordHash = this.password;
  const isValidPassword = await bcrypt.compare(passwordByUser, passwordHash);
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
