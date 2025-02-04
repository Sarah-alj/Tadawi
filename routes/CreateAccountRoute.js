const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Signup page
router.get("/signup", (req, res) => res.render("CreateAccount"));

// Handle signup
router.post("/signup", authController.signup);

module.exports = router;
