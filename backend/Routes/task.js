/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

const express = require('express');
const app = express();
const router = express.Router();
const Task = require('../model/task.model');

app.use(express.json());

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({error: 'Error fetching tasks'});
    }
});

router.post('/task', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
        createdBy: req.body.createdBy
    });

    try {
        const savedTask = await task.save();
        res.json(savedTask);
        res.status(200).json({message: 'Item added successfully'});
    } catch (err) {
        res.status(400).json({error: 'Error adding item'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
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
        res.status(500).json({error: 'Error updating task'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const response = await task.remove();
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;