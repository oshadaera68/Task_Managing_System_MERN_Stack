/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/
const express = require('express')
const app = express();
const router = express.Router()
const SignUp = require('../model/signup.model');

router.post('/signup', async (req, res) => {
    const signups = new SignUp({
        name: req.body.name, email: req.body.email, password: req.body.password, role: req.body.role
    });
    try {
        await signups.save();
        res.status(200).send('Signup successful');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router