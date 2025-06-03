/**
 * Coded By: Era Boy
 * Version: v0.1.0
 **/

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignUp',
        required: true
    }
}, {
    timestamps: true // adds createdAt and updatedAt fields
});


module.exports = mongoose.model('Task', taskSchema);