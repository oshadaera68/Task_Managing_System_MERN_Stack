/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

const mongoose = require('mongoose');

const signinSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Signin', signinSchema);