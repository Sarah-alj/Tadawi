const Doctor = require("../models/Doctor");
const Donor = require("../models/Donor");
const Patient = require("../models/Patient");

// Edit Profile (Doctor)
exports.editDoctorProfile = async (req, res) => {
    await Doctor.findByIdAndUpdate(req.user._id, req.body);
    res.redirect("/dashboard");
};

// Edit Profile (Donor)
exports.editDonorProfile = async (req, res) => {
    await Donor.findByIdAndUpdate(req.user._id, req.body);
    res.redirect("/dashboard");
};

// Edit Profile (Patient)
exports.editPatientProfile = async (req, res) => {
    await Patient.findByIdAndUpdate(req.user._id, req.body);
    res.redirect("/dashboard");
};
