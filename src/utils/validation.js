const validator = require("validator");

/**
 * Validates signup data ensuring required fields are present and properly formatted
 * @param {Object} req - The request object containing user data
 * @throws {Error} If validation fails
 */
const validateSignupData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    gender,
    dob,
    ...extraFields
  } = req.body;

  // Check for extra fields
  if (Object.keys(extraFields).length > 0) {
    throw new Error("Extra fields are not allowed");
  }

  // Name validations
  if (!firstName || !firstName.trim()) {
    throw new Error("First name can't be empty");
  }
  if (firstName.length > 30) {
    throw new Error("First name is too long (maximum 30 characters)");
  }

  if (!lastName || !lastName.trim()) {
    throw new Error("Last name can't be empty");
  }
  if (lastName.length > 30) {
    throw new Error("Last name is too long (maximum 30 characters)");
  }

  // DOB validation
  if (!dob) {
    throw new Error("Date of birth is required");
  }

  validateDOB(dob);

  // Email validation
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address");
  }

  // Password validation
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Please enter a strong password that contains at least 8 characters, including 1 number and 1 symbol"
    );
  }

  // Gender validation
  const allowedGenders = ["male", "female", "others"];
  if (!gender || !allowedGenders.includes(gender.toLowerCase())) {
    throw new Error("Gender must be one of: male, female, or others");
  }
};

/**
 * Validates fields for user profile edits
 * @param {Object} req - The request object containing fields to update
 * @throws {Error} If validation fails
 */
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
    ...extraFields
  } = req.body;

  // Check for extra fields
  if (Object.keys(extraFields).length > 0) {
    throw new Error("Extra fields are not allowed");
  }

  // First name validation
  if (firstName !== undefined) {
    if (typeof firstName !== "string" || !firstName.trim()) {
      throw new Error("First name cannot be empty");
    }
    if (firstName.length < 3 || firstName.length > 15) {
      throw new Error("First name must be between 3 and 15 characters");
    }
  }

  // Last name validation
  if (lastName !== undefined) {
    if (typeof lastName !== "string" || !lastName.trim()) {
      throw new Error("Last name cannot be empty");
    }
    if (lastName.length < 3 || lastName.length > 15) {
      throw new Error("Last name must be between 3 and 15 characters");
    }
  }

  // DOB validation
  if (dob !== undefined) {
    validateDOB(dob);
  }

  // Gender validation
  if (gender !== undefined) {
    const allowedGenders = ["male", "female", "others"];
    if (
      typeof gender !== "string" ||
      !allowedGenders.includes(gender.toLowerCase())
    ) {
      throw new Error("Gender must be one of: male, female, or others");
    }
  }

  // Photo URL validation
  if (photoURL !== undefined) {
    if (!photoURL.trim()) {
      throw new Error("Photo URL cannot be empty");
    }
    if (!validator.isURL(photoURL)) {
      throw new Error("Please provide a valid URL for the photo");
    }
  }

  // Age validation
  if (age !== undefined) {
    const ageNum = Number(age);
    if (isNaN(ageNum)) {
      throw new Error("Age must be a number");
    } else if (ageNum < 16) {
      throw new Error("You must be at least 16 years old to use this service");
    } else if (ageNum > 100) {
      throw new Error("Age cannot be greater than 100");
    }
  }

  // Skills validation
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      throw new Error("Skills must be provided as an array");
    }
    if (skills.length > 10) {
      throw new Error("Maximum of 10 skills allowed");
    }
    // Validate each skill is a string
    for (const skill of skills) {
      if (typeof skill !== "string" || !skill.trim()) {
        throw new Error("Each skill must be a non-empty string");
      }
      if (skill.length > 30) {
        throw new Error("Each skill must be maximum 30 characters");
      }
    }
  }

  // About validation
  if (about !== undefined) {
    if (typeof about !== "string") {
      throw new Error("About must be a string");
    }
    if (about.length > 100) {
      throw new Error("About section is limited to 100 characters");
    }
  }
};

/**
 * Validates password change request
 * @param {Object} req - The request object containing password data
 * @throws {Error} If validation fails
 */
const validateNewPassword = (req) => {
  const { currentPassword, newPassword, ...extraFields } = req.body;

  // Check for extra fields
  if (Object.keys(extraFields).length > 0) {
    throw new Error("Extra fields are not allowed");
  }

  // Validate current password
  if (!currentPassword || !currentPassword.trim()) {
    throw new Error("Current password is required");
  }

  // Validate new password
  if (!newPassword || !newPassword.trim()) {
    throw new Error("New password is required");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "Please enter a strong password that contains at least 8 characters, including 1 number and 1 symbol"
    );
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }
};

/**
 * Helper function to validate date of birth
 * @param {string} dob - Date of birth string
 * @throws {Error} If DOB validation fails
 */
const validateDOB = (dob) => {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    throw new Error("Invalid date of birth format. Use YYYY-MM-DD");
  }

  // Check if it's a valid date
  const parsedDob = new Date(dob);
  if (isNaN(parsedDob.getTime())) {
    throw new Error("Invalid date. Please enter a real date");
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - parsedDob.getFullYear();
  const monthDiff = today.getMonth() - parsedDob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < parsedDob.getDate())
  ) {
    age--;
  }

  // Check minimum age
  if (age < 16) {
    throw new Error("You must be at least 16 years old to use this service");
  }

  // Check if date is in the future
  if (parsedDob > today) {
    throw new Error("Date of birth cannot be in the future");
  }

  // Check reasonable maximum age
  if (age > 100) {
    throw new Error("Date of birth indicates an age over 100, please verify");
  }
};

module.exports = {
  validateSignupData,
  validateEditFields,
  validateNewPassword,
};
