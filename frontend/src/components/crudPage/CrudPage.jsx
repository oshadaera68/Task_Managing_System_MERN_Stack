import React, {useEffect, useState} from 'react';
import {Alert, Button, Container, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from "axios";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function CrudPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const editingTask = location.state?.task || null;

    const [formData, setFormData] = useState({
        title: '', description: '', priority: '', status: '', createdBy: ''
    });

    const [value, setValue] = useState(dayjs());
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                status: editingTask.status,
                createdBy: editingTask.createdBy
            });
            setValue(dayjs(editingTask.dueDate));
        } else {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setFormData(prev => ({
                        ...prev, createdBy: decoded.id
                    }));
                } catch (err) {
                    console.error("Failed to decode token", err);
                }
            }
        }
    }, [editingTask]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!formData.title.trim()) validationErrors.title = "Title is required.";
        if (!formData.description.trim()) validationErrors.description = "Description is required.";
        if (!formData.priority.trim()) validationErrors.priority = "Priority is required.";
        if (!formData.status.trim()) validationErrors.status = "Status is required.";
        if (!value) validationErrors.dueDate = "Due date is required.";
        if (!formData.createdBy.trim()) validationErrors.createdBy = "Created By is required.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const taskData = {
                ...formData, dueDate: value.format("YYYY-MM-DD")
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            };

            if (editingTask) {
                await axios.put(`http://localhost:4000/task/${editingTask._id}`, taskData, config);
                setSnackbarMessage("Task updated successfully!");
            } else {
                await axios.post("http://localhost:4000/task", taskData, config);
                setSnackbarMessage("Task added successfully!");
            }

            setSnackbarSeverity('success');
            setOpen(true);

            setFormData({
                title: '', description: '', priority: '', status: '', createdBy: ''
            });
            setValue(dayjs());
            setErrors({});

            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            console.error("Error saving task:", error.message);
            if (error.response) {
                console.error("Server response:", error.response.data);
            }
            setSnackbarMessage("An error occurred. Please try again.");
            setSnackbarSeverity('error');
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (<div className="min-h-screen bg-blue-700 bg-no-repeat bg-cover flex items-center justify-center px-4">
            <Link to='/dashboard'>
                <ArrowBackIosIcon className="absolute top-6 left-6 text-white"/>
            </Link>

            <Container
                maxWidth="md"
                className="bg-white bg-opacity-90 rounded-lg p-6 md:p-10 shadow-xl w-full max-w-2xl"
            >
                <h1 className="mb-6 text-center text-2xl md:text-3xl font-semibold font-poppins text-gray-800">
                    Task Manager - {editingTask ? 'Edit Task' : 'New Task'}
                </h1>

                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity={snackbarSeverity}
                        variant="filled"
                        sx={{width: '100%'}}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <TextField
                        required
                        id="title"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        required
                        id="description"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            variant="outlined"
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                        {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.status}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            variant="outlined">
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="Pending">Pending 🔴</MenuItem>
                            <MenuItem value="In Progress">In Progress 🟡</MenuItem>
                            <MenuItem value="Completed">Completed 🟢</MenuItem>
                        </Select>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Due Date"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true, error: !!errors.dueDate, helperText: errors.dueDate
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        required
                        id="createdBy"
                        label="Created By"
                        name="createdBy"
                        value={formData.createdBy}
                        InputProps={{readOnly: true}}
                        fullWidth
                        error={!!errors.createdBy}
                        helperText={errors.createdBy}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        className="w-full md:w-1/3 mx-auto justify-center"
                    >
                        {editingTask ? 'Update' : 'Add'} Task
                    </Button>
                </form>
            </Container>
        </div>);
}
