const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, gender, ...extrafields } =
    req.body;

  if (!firstName) {
    throw new Error("name can't be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error(
      "This is invalid email. please enter a valid email address"
    );
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password. ");
  } else if (Object.keys(extrafields).length > 0) {
    throw new Error("extra fields is not allowed");
  }
  const allowed_genders = ["male", "female", "others"];
  if (!gender || !allowed_genders.includes(gender.toLowerCase())) {
    throw new Error("gender should be from male, female or others");
  }
};

module.exports = {
  validateSignupData,
};
