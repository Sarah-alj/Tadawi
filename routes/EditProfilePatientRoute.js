const express = require("express");
const router = express.Router();
const editProfileController = require("../controllers/editProfileController");

// Edit Patient Profile
router.post("/edit/patient", editProfileController.editPatientProfile);

module.exports = router;
