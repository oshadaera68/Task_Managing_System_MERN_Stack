/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

// routes/task.js
const express = require('express');
const router = express.Router();
const Task = require('../model/task.model');
const authenticate = require('../middleware/authenticate');
const app = express();

app.use(express.json());

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({error: 'Error fetching tasks'});
    }
});

// CREATE task — requires login
router.post('/task', authenticate, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
        createdBy: req.user.userId // token gives this
    });

    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: 'Error adding task' });
    }
});

// UPDATE task — only owner can modify
router.put('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only edit your own tasks' });
        }

        task.title = req.body.title;
        task.description = req.body.description;
        task.priority = req.body.priority;
        task.status = req.body.status;
        task.dueDate = req.body.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

// DELETE task — only owner can delete
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own tasks' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
