/**
 * Coded By: Era Boy
 * Version: v0.1.0
 */

const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction

// Define a schema for user sign-in data
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

// Export the SignIn model based on the schema
// This allows the schema to be used elsewhere in the application
module.exports = mongoose.model('SignIn', signInSchema);
