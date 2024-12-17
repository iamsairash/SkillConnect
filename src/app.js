const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Namaste from dashboard");
});

app.use("/home", (req, res) => {
  res.send("Namaste from HOme");
});

app.listen(4000, () => {
  console.log("Server started ");
});
