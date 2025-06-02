/**
 * Coded By: Era Boy
 * Version: v0.1.0
 **/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const signUpSchema = new mongoose.Schema({
    name: { type: String, required: false }, // optional, if you want to store names
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: 'user' }
});

// Pre-save hook to hash password automatically before saving
signUpSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password for login
signUpSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('SignUp', signUpSchema);

