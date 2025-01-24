const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my backend service!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
