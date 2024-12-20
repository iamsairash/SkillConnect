const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ name: "Sairash", age: 23 });
});

app.post("/user", (req, res) => {
  res.send("data saved to db");
});

app.delete("/user", (req, res) => {
  res.send("deleted successfully");
});

app.use("/test", (req, res) => {
  res.send("Namaste from test");
});

app.listen(4000, () => {
  console.log("Server started ");
});
