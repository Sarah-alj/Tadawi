const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    specialization: { type: String, required: true },
    institution: { type: String, required: true },
    contactMethod: { type: String, required: true },
    riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
    trialDescription: { type: String },
    patientRequirements: { type: String },
    trialStart: { type: Date },
    trialEnd: { type: Date },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
