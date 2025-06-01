/**
 * Coded By: Era Boy
 * Version: v0.1.0
 **/

const mongoose = require('mongoose'); // Import Mongoose to define the schema and interact with MongoDB
const bcrypt = require('bcrypt');     // Import bcrypt for password hashing

// Define the schema for user signup
const signupSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    }, email: {
        type: String, required: true, unique: true
    }, password: {
        type: String, required: true
    }, role: {
        type: String, default: "user"
    }
});

// Pre-save hook to hash the password before saving to the database
signupSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();

    // Hash the password using bcrypt with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to save
});

// Export the model so it can be used in other parts of the application
module.exports = mongoose.model('SignUp', signupSchema);
