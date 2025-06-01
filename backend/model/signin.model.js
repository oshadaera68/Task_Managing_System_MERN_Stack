/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

const mongoose = require('mongoose');

const signInSchema = new mongoose.Schema({
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

module.exports = mongoose.model('SignIn', signInSchema);