import React, { useState, useEffect } from 'react';
import {
    AppBar, Box, Button, Dialog, DialogActions,
    DialogTitle, Toolbar, Typography, Card, CardContent
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => setOpen(true);

    const confirmLogout = () => {
        logout();
        setOpen(true);
        navigate('/login');
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    useEffect(() => {
        if (user) fetchTasks().then(r => console.log(r));
    }, [user]);

    return (
        <>
            <div className="absolute w-full h-full bg-blue-300 bg-cover bg-no-repeat">
                <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: 'black' }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Task Manager
                            </Typography>

                            {user ? (
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            ) : (
                                <>
                                    <Link to="/register"><Button color="inherit">Register</Button></Link>
                                    <Link to="/login"><Button color="inherit">Logout</Button></Link>
                                </>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>

                <Dialog open={open} onClose={() => setOpen(true)}>
                    <DialogTitle>Are you sure about the logout?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>No</Button>
                        <Button onClick={confirmLogout} autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>

                <h1 className="mb-4 text-center" style={{ fontSize: "34px", fontFamily: "Poppins" }}>
                    Dashboard
                </h1>

                <Typography variant="h6" component="div" sx={{ fontFamily: "Open Sans", color: "black"}}>
                    Welcome {user?.email}
                </Typography>
                <br />
                <Typography variant="h6" component="div" sx={{ fontFamily: "Open Sans", color: "black"}}>
                    Your Tasks:
                </Typography>

                <Link to='/crud'>
                    <Button variant="contained" className="absolute w-24" color="secondary" style={{ left: "105rem" }}>
                        Add
                    </Button>
                </Link>

                {/* Task List */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 4 }}>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <Card key={index} sx={{ minWidth: 275, backgroundColor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        Title: {task.title}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Description: {task.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Status: {task.status}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Priority: {task.priority}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Due Date: {task.dueDate}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Created By: {task.createdBy}
                                    </Typography>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => setCurrentTask(task)}
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
                        <Typography sx={{ color: 'black', marginTop: 2 }}>
                            No tasks available.
                        </Typography>
                    )}
                </Box>
            </div>
        </>
    );
}
