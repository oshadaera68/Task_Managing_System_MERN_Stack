const express = require('express');
const router = express.Router();
const Task = require('../model/task.model');
const auth = require('../middleware/auth');

// 🔒 Get all tasks for logged-in user
router.get('/', auth, async (req, res, next) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

// 🔒 Create task — assign `createdBy` from token
router.post('/', auth, async (req, res, next) => {
    try {
        const task = new Task({ ...req.body, createdBy: req.user.id });
        const saved = await task.save();
        res.status(201).json({ message: 'Task added', task: saved });
    } catch (err) {
        next(err);
    }
});

// 🔒 Update task — only if owner
router.put('/:id', auth, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.createdBy.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized to update this task' });

        Object.assign(task, req.body);
        const updated = await task.save();
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

// 🔒 Delete task — only if owner
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.createdBy.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized to delete this task' });

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
