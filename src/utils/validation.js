const validator = require("validator");

const validateSignupData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    gender,
    dob,
    ...extrafields
  } = req.body;

  if (!firstName || !firstName.trim()) {
    throw new Error("first name can't be empty");
  }
  if (firstName.length > 30) {
    throw new Error("length of first name is too large.");
  }
  if (!lastName || !lastName.trim()) {
    throw new Error("last name can't be empty");
  }
  if (lastName.length > 30) {
    throw new Error("length of last name is too large.");
  }
  if (!dob) {
    throw new Error("DOB is required");
  }
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error(
      "This is invalid email. please enter a valid email address"
    );
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Please Enter a strong password. {minLength: 8, minNumber: 1, minSymbol:1"
    );
  }
  if (Object.keys(extrafields).length > 0) {
    throw new Error("extra fields is not allowed");
  }
  const allowed_genders = ["male", "female", "others"];
  if (!gender || !allowed_genders.includes(gender.toLowerCase())) {
    throw new Error("gender should be from male, female or others");
  }
};

const validateEditFields = (req) => {
  const {
    firstName,
    lastName,
    gender,
    skills,
    age,
    about,
    photoURL,
    dob,
    ...extrafields
  } = req.body;

  if (Object.keys(extrafields).length > 0) {
    throw new Error("can't update extra fields");
  }
  if (firstName !== undefined) {
    if (
      typeof firstName !== "string" ||
      firstName.length < 3 ||
      firstName.length > 15
    ) {
      throw new Error("The letters in mame must be between 3 and 15");
    }
  }
  if (lastName !== undefined) {
    if (
      typeof lastName != "string" ||
      lastName.length < 3 ||
      lastName.length > 15
    ) {
      throw new Error("The letters in mame must be between 3 and 15");
    }
  }
  if (gender !== undefined) {
    if (
      typeof gender !== "string" ||
      !["male", "female", "other"].includes(gender.toLowerCase())
    ) {
      throw new Error("only genders should be male, female, and others");
    }
  }

  if (!validator.isURL(photoURL)) {
    throw new Error("invalid photoURL");
  }

  if (age !== undefined) {
    const ageNum = Number(age);
    if (Number.isNaN(ageNum)) {
      throw new Error("Age should be a number");
    } else if (age < 0) {
      throw new Error("Age can't be negative");
    } else if (age > 100) {
      throw new Error("Age can't be greater than 100");
    }
  } else if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      throw new Error("It should be in array");
    }
    if (skills.length > 10) {
      throw new Error("skills should be upto 10 only");
    }
  }
  if (about !== undefined) {
    if (typeof about !== "string" || about.length > 100) {
      throw new Error("about should be upto 100 letters only");
    }
  }
};

const validateNewPassword = (req) => {
  const { currentPassword, newPassword, ...extrafields } = req.body;
  if (!currentPassword) {
    throw new Error("currentPassword is required");
  }
  if (!newPassword) {
    throw new Error("newPassword must be provided");
  } else {
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("please Enter a strong password");
    }
  }

  if (Object.keys(extrafields).length > 0) {
    throw new Error("Extra fields are not allowed");
  }
};

module.exports = {
  validateSignupData,
  validateEditFields,
  validateNewPassword,
};
