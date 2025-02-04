const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    title: { type: String, enum: ["Mr", "Mrs", "Dr"], required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    region: { type: String, required: true },
    nationality: { type: String, required: true },
});

module.exports = mongoose.model("Donor", DonorSchema);
