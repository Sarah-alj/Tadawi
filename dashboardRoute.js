const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Dashboard Route (Protected)
router.get("/", isAuthenticated, getDashboardData);

module.exports = router;
