const express = require("express");
const router = express.Router();
const editProfileController = require("../controllers/editProfileController");

// Edit Doctor Profile
router.post("/edit/doctor", editProfileController.editDoctorProfile);

module.exports = router;
