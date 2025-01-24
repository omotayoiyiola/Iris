const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
require("dotenv").config();

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON body

// Fake user data for demo purposes
const users = [
  {
    name: "John",
    email: "user1@example.com",
    password: "$2a$10$9KSbXrKsnaqYrw5xt1Re.euRnMyHH0m8rJUozGA0GqGxv7Jphg22u",
    role: "Iris-setosa",
  }, // password: "password123"
  {
    name: "Smart",
    email: "user2@example.com",
    password: "$2a$10$9KSbXrKsnaqYrw5xt1Re.euRnMyHH0m8rJUozGA0GqGxv7Jphg22u",
    role: "Iris-virginica",
  }, // password: "password123"
];

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my backend service!");
});

// Auth Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  // Validate password
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token and user data in response
    res.json({
      token,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });
});

// Route to fetch data based on variety
app.get("/getData", (req, res) => {
  const { variety } = req.query; // Query param to specify the variety
  const results = [];

  if (!variety) {
    return res.status(400).json({ error: "Variety is required" });
  }

  fs.createReadStream(path.join(__dirname, "iris.csv"))
    .pipe(csv())
    .on("data", (row) => {
      if (row.variety === variety) {
        results.push(row);
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: `No records found for ${variety}` });
      }
      res.json(results);
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Protected Route
app.get("/dashboard", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid token" });

    res.json({
      message: `Welcome to the dashboard, ${decoded.email}. You have access to ${decoded.role} data.`,
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
