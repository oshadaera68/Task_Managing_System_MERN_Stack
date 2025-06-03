const { Router } = require("express");
const router = Router();
const SignUp = require('../model/signup.model');

router.post('/', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await SignUp.findOne({ email });
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const newUser = new SignUp({ name, email, password, role });
        await newUser.save();

        res.status(201).send('Signup successful');
    } catch (error) {
        next(error);  // <-- Pass error to middleware
    }
});

module.exports = router;
