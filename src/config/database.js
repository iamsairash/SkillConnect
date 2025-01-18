const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devtinder:ycTIV5oo5Kuju8v6@devtinder.t5dlf.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};
