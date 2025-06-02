import React, {useEffect, useState} from 'react';
import {
    AppBar, Box, Button, Card, CardContent, IconButton, Toolbar, Tooltip, Typography,
    Dialog, DialogActions, DialogTitle, Snackbar, CircularProgress
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deletedTask, setDeletedTask] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const handleClickOpen = (id) => {
        setSelectedTaskId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/task');
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logOutModel = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            navigate('/login');
        }
    };

    const deleteTask = async () => {
        if (!selectedTaskId) return;
        const taskToDelete = tasks.find(t => t._id === selectedTaskId);
        try {
            await axios.delete(`http://localhost:4000/task/${selectedTaskId}`);
            setDeletedTask(taskToDelete);
            setTasks(prev => prev.filter(task => task._id !== selectedTaskId));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setOpen(false);
            setSelectedTaskId(null); // reset after deletion
        }
    };

    const undoDelete = async () => {
        if (deletedTask) {
            try {
                await axios.post('http://localhost:4000/task', deletedTask);
                fetchTasks();
            } catch (error) {
                console.error('Error restoring task:', error);
            }
        }
        setSnackbarOpen(false);
        setDeletedTask(null);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="absolute w-full h-full bg-blue-300 bg-cover bg-no-repeat">
            <Box sx={{flexGrow: 1}} style={{backgroundColor: 'black'}}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Task Manager
                        </Typography>
                        <Link to="/register"><Button color="inherit">Register</Button></Link>
                        <Button color="inherit" onClick={logOutModel}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <h1 className="mb-4 text-center" style={{fontSize: "34px", fontFamily: "Poppins"}}>
                Dashboard
            </h1>
            <br/>
            <Typography variant="h6" sx={{fontFamily: "Open Sans", color: "black"}}>
                Your Tasks:
            </Typography>

            <Link to='/crud'>
                <Button variant="contained" color="secondary" style={{position: "absolute", right: 32}}>
                    <AddIcon/>
                </Button>
            </Link>

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this task?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={deleteTask} color="error" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Undo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message="Task deleted"
                action={
                    <Button color="secondary" size="small" onClick={undoDelete}>
                        UNDO
                    </Button>
                }
            />

            {/* Loading Spinner or Task Cards */}
            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, padding: 4}}>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Card key={task._id} sx={{minWidth: 275, backgroundColor: '#f5f5f5'}}>
                                <CardContent>
                                    <Typography variant="h6">Title: {task.title}</Typography>
                                    <Typography sx={{mb: 1.5}} color="text.secondary">
                                        Description: {task.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        Status: {task.status}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        Priority: {task.priority}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        Due Date: {task.dueDate}
                                    </Typography>

                                    <Box sx={{display: 'flex', gap: 1, mt: 2}}>
                                        <Link to="/crud" state={{task}}>
                                            <Tooltip title="Edit Task">
                                                <IconButton color="warning" size="small">
                                                    <EditIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                        <Tooltip title="Delete Task">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleClickOpen(task._id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography sx={{color: 'black', marginTop: 2}}>
                            No tasks available.
                        </Typography>
                    )}
                </Box>
            )}
        </div>
    );
}
