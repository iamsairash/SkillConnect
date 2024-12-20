const express = require("express"); // Import the Express framework
const app = express(); // Create an instance of the Express app

// Handle GET requests to "/user" with optional query parameters
app.get("/user", (req, res) => {
  console.log(req.query); // Log query parameters from the URL (e.g., ?key=value)
  res.send({ name: "Sairash", age: 23 }); // Respond with a JSON object
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
