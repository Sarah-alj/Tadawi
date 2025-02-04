const express = require("express");
const router = express.Router();

router.use("/", require("./CreateAccountRoute"));
router.use("/", require("./DoctorRoute"));
router.use("/", require("./DonorRoute"));
router.use("/", require("./PatientRoute"));
router.use("/", require("./EditProfileDoctorRoute"));
router.use("/", require("./EditProfileDonorRoute"));
router.use("/", require("./EditProfilePatientRoute"));

module.exports = router;
