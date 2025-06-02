import React, { useState, useEffect } from 'react';
import {
    AppBar, Box, Button, Toolbar, Typography, Card, CardContent
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


export default function Dashboard() {
    // State to store fetched tasks
    const [tasks, setTasks] = useState([]);

    // State to track the task currently being edited
    const [currentTask, setCurrentTask] = useState(null);

    // Function to fetch tasks from backend API
    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:4000/task');
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
        }
    };

    // Function to delete a task by ID
    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:4000/task/${id}`, {
                method: 'DELETE'
            });
            // Remove deleted task from state
            setTasks(prev => prev.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // useEffect to fetch tasks once when the component mounts
    // Fetch tasks on component load
    useEffect(() => {
        fetchTasks().then(r => {});
    }, []); // Dependency: re-run if user changes

    return (
        <div className="absolute w-full h-full bg-blue-300 bg-cover bg-no-repeat">
            {/* Top navigation bar */}
            <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: 'black' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Task Manager
                        </Typography>
                        {/* Navigation buttons */}
                        <>
                            <Link to="/register"><Button color="inherit">Register</Button></Link>
                            <Link to="/login"><Button color="inherit">Logout</Button></Link>
                        </>
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Welcome message */}
            <h1 className="mb-4 text-center" style={{ fontSize: "34px", fontFamily: "Poppins" }}>
                Dashboard
            </h1>
            <br />
            <Typography variant="h6" sx={{ fontFamily: "Open Sans", color: "black" }}>
                Your Tasks:
            </Typography>

            {/* Add Task button */}
            <Link to='/crud'>
                <Button variant="contained" color="secondary" style={{ position: "absolute", right: 32 }}>
                    Add
                </Button>
            </Link>

            {/* Task list container */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 4 }}>
                {/* Render tasks if available */}
                {tasks && tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <Card key={index} sx={{ minWidth: 275, backgroundColor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography variant="h6">Title: {task.title}</Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Description: {task.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Status: {task.status}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Priority: {task.priority}
                                </Typography>

                                {/* Edit and Delete buttons */}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setCurrentTask(task)} // Just sets state, actual edit logic not shown
                                        className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                                    >
                                        <EditIcon fontSize="small" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                    >
                                        <DeleteIcon fontSize="small" />
                                        Delete
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    // Fallback if no tasks are found
                    <Typography sx={{ color: 'black', marginTop: 2 }}>
                        No tasks available.
                    </Typography>
                )}
            </Box>
        </div>
    );
}
