/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/
const express = require('express');
const router = express.Router();
const app = express();
const SignIn = require('../model/signin.model');

router.post('/signin', async (req, res) => {
    const signIns = new SignIn({
        email: req.body.email, password: req.body.password
    });
    try {
        await signIns.save();
        res.status(200).send('SignIn successful');
    } catch (error) {
        res.status(400).send(error);
    }
});