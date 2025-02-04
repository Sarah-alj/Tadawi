const User = require("../models/User");
const ClinicalTrial = require("../models/ClinicalTrial");
const Donation = require("../models/Donation");

exports.getDashboardData = async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalPatients = await User.countDocuments({ role: "patient" });
        const totalDonors = await User.countDocuments({ role: "donor" });
        const totalClinicalTrials = await ClinicalTrial.countDocuments();
        const totalDonations = await Donation.countDocuments();

        // Fetch latest users and trials for display
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const latestTrials = await ClinicalTrial.find().sort({ createdAt: -1 }).limit(5);

        res.render("dashboard", {
            totalDoctors,
            totalPatients,
            totalDonors,
            totalClinicalTrials,
            totalDonations,
            latestUsers,
            latestTrials,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
