const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SignIn = require('../model/signup.model'); // assuming signup stores users
const express = require('express')
const app = express();
const router = express.Router()

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here';

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await SignIn.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router
