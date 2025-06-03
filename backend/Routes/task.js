const express = require('express');
const router = express.Router();
const Task = require('../model/task.model');

// Get all tasks
router.get('/', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

// Create new task
router.post('/', async (req, res, next) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            dueDate: req.body.dueDate,
            createdBy: req.body.createdBy
        });

        const savedTask = await task.save();
        res.status(201).json({ message: 'Task added successfully', task: savedTask });
    } catch (err) {
        next(err);
    }
});

// Update task
router.put('/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.title = req.body.title;
        task.description = req.body.description;
        task.priority = req.body.priority;
        task.status = req.body.status;
        task.dueDate = req.body.dueDate;
        task.createdBy = req.body.createdBy;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        next(err);
    }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
