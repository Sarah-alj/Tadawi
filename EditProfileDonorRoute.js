const express = require("express");
const router = express.Router();
const editProfileController = require("../controllers/editProfileController");

// Edit Donor Profile
router.post("/edit/donor", editProfileController.editDonorProfile);

module.exports = router;
