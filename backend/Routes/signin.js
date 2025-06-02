const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SignUp = require("../model/signup.model"); // ✅ USE THIS

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await SignUp.findOne({ email });
        console.log("User from DB:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password (user not found)" });
        }

        const isMatch = await user.comparePassword(password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password (wrong password)" });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret", // fallback for dev
            { expiresIn: "1d" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
