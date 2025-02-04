const User = require("../models/User");

// Signup Controller
exports.signup = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = new User({ email, password, role });
        await user.save();
        res.redirect("/login");
    } catch (error) {
        res.status(400).send("Error creating account");
    }
};
