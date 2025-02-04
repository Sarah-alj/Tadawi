const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Update Password Logic
exports.updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Encrypt new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password in the database
        const user = await User.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Redirect to success page after password update
        res.redirect("/password-success");
    } catch (err) {
        res.status(500).json({ message: "Error updating password", error: err });
    }
};
