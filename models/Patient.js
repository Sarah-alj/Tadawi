const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    region: { type: String, required: true },
    nationality: { type: String, required: true },
});

module.exports = mongoose.model("Patient", PatientSchema);
