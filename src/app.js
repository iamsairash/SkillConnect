/*

const express = require("express"); // Import the Express framework
const app = express(); // Create an instance of the Express app

// Handle GET requests to "/user" with optional query parameters
app.get("/user", (reqq, ress) => {
  console.log(reqq.query); // Log query parameters from the URL (e.g., ?key=value)
  ress.send({ name: "Sairash", age: 23 }); // Respond with a JSON object
});

// Handle GET requests to "/abc/:userId/:name/:pw" with dynamic route parameters
app.get("/abc/:userId/:name/:pw", (req, res) => {
  res.send(req.params); // Respond with the captured route parameters
});

// Handle POST requests to "/user"
app.post("/user", (req, res) => {
  res.send("Data saved to the database"); // Simulate saving data to a database
});

// Handle DELETE requests to "/user"
app.delete("/user", (req, res) => {
  res.send("Deleted successfully"); // Simulate deleting a record
});

// Middleware for all requests to "/test"
app.use("/test", (req, res) => {
  res.send("Namaste from test"); // Respond with a greeting
});

// Start the server on port 4000
app.listen(4000, () => {
  console.log("Server started on port 4000"); // Log that the server is running
});

*/

// playing with multiple router handlers
/*
const express = require("express");

const app = express();
const PORT = 9999;

app.use("/user", [
  (req, res, nxt) => {
    console.log("first route handler");
    nxt();
  },
  (req, res, next) => {
    // res.send("This is second route handler");
    console.log("second route handler");

    next();
  },
  (resss, reqqq, nexttt) => {
    console.log("3rd route hadler");
    reqqq.send("3rd one");
  },
]);

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
*/

/*

const express = require("express"); // Import the Express framework
const app = express(); // Create an instance of the Express app
const PORT = 7777;

app.get("/admin/getAllData", (req, res) => {
  const token = "abc";
  const isAuthorized = token === "abca";
  if (isAuthorized) {
    res.send("All the data sent");
  } else {
    res.status(401).send("unauthorizd user");
  }
});

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
*/

/*
const express = require("express");
const { authAdmin, authUser } = require("../middlewares/auth.js");

const app = express();
const PORT = 7777;

app.use("/admin", authAdmin);
app.use("/admin/getAllData", (req, res) => {
  res.send("all data sent!!!");
});

app.use("/user/login", (req, res, next) => {
  res.send("login here!!");
});
app.use("/user/getData", authUser, (req, res) => {
  res.send("got user data here!!");
});

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});

*/

const express = require("express");

const app = express();
const PORT = 7777;

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("some error is here");
  }
});

app.get("/getUserData", (req, res) => {
  //   try {
  throw new Error("thrown error");
  res.send("got the use data");
  //   } catch (err) {
  //     console.log(err);
  //     res.send("error catched");
  //   }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("some error is here");
  }
});

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
