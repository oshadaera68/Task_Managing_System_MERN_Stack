import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    Snackbar,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {Link, useNavigate,} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

// Utility: Sort by priority then due date
const sortTasks = (tasks) => {
    const priorityOrder = {Low: 1, Medium: 2, High: 3};
    return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 4;
        const priorityB = priorityOrder[b.priority] || 4;
        if (priorityA !== priorityB) return priorityA - priorityB;

        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
    });
};

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deletedTask, setDeletedTask] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const navigate = useNavigate();

    const handleClickOpen = (id) => {
        setSelectedTaskId(id);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found. Please login.');

            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            const res = await axios.get(`https://tms-backend-7mx2.onrender.com/task`, config);
            setTasks(sortTasks(res.data)); // <-- Sort here
        } catch (error) {
            console.error("Error fetching tasks:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutDialogOpen = () => setLogoutDialogOpen(true);
    const handleLogoutDialogClose = () => setLogoutDialogOpen(false);

    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const deleteTask = async () => {
        if (!selectedTaskId) return;
        const taskToDelete = tasks.find(t => t._id === selectedTaskId);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found. Please login.');

            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            await axios.delete(`http://localhost:5000/api/task/${selectedTaskId}`, config);
            setDeletedTask(taskToDelete);
            setTasks(prev => prev.filter(task => task._id !== selectedTaskId));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting task:', error.response?.data || error.message);
        } finally {
            setOpen(false);
            setSelectedTaskId(null);
        }
    };

    const undoDelete = async () => {
        if (deletedTask) {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found. Please login.');

                const config = {
                    headers: {Authorization: `Bearer ${token}`}
                };

                await axios.post(`http://localhost:5000/api/task`, deletedTask, config);
                fetchTasks(); // Will re-sort
            } catch (error) {
                console.error('Error restoring task:', error.response?.data || error.message);
            }
        }
        setSnackbarOpen(false);
        setDeletedTask(null);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (<div className="min-h-screen bg-blue-300 bg-cover bg-no-repeat">
        <Box sx={{flexGrow: 1}} className="bg-black">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Task Manager
                    </Typography>
                    <Link to="/register"><Button color="inherit">Register</Button></Link>
                    <Button color="inherit" onClick={handleLogoutDialogOpen}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>

        <div className="p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl text-center font-semibold font-poppins mb-6">
                Dashboard
            </h1>

            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-sans text-black">
                    Your Tasks:
                </Typography>

                <Link to='/crud'>
                    <Button variant="contained" color="secondary" className="!p-2">
                        <AddIcon/>
                    </Button>
                </Link>
            </div>

            {/* Delete Task Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={deleteTask} color="error" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Logout Dialog */}
            <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
                <DialogTitle>Do you really want to logout?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleLogoutDialogClose}>Cancel</Button>
                    <Button onClick={confirmLogout} color="error" autoFocus>Logout</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                message="Task deleted"
                action={<Button color="secondary" size="small" onClick={undoDelete}>
                    UNDO
                </Button>}
            />

            {/* Loading or Tasks */}
            {isLoading ? (<div className="flex justify-center mt-10">
                <CircularProgress/>
            </div>) : (<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tasks.length > 0 ? (tasks.map((task) => (
                    <Card key={task._id} sx={{backgroundColor: '#f5f5f5', cursor: 'pointer'}}
                          className="w-full" onClick={() => navigate('/crud', {state: {task}})}>
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
                    </Card>))) : (<Typography sx={{color: 'black', marginTop: 2}}>
                    No tasks available.
                </Typography>)}
            </div>)}
        </div>
    </div>);
}
