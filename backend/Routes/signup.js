const bcrypt = require('bcryptjs');
const SignUp = require('../model/signup.model');
const { Router } = require("express");
const router = Router();

router.post('/', async (req, res) => {  // <-- use '/' here
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await SignUp.findOne({ email });
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user with hashed password
        const newUser = new SignUp({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).send('Signup successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
