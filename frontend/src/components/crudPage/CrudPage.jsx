import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from "axios";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <--- Added

export default function CrudPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const editingTask = location.state?.task || null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: '',
        status: '',
        createdBy: ''
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
            // Decode token and set createdBy
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setFormData(prev => ({
                        ...prev,
                        createdBy: decoded.id // or decoded.email, if you prefer
                    }));
                } catch (err) {
                    console.error("Failed to decode token", err);
                }
            }
        }
    }, [editingTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
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
                ...formData,
                dueDate: value.format("YYYY-MM-DD")
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
                title: '',
                description: '',
                priority: '',
                status: '',
                createdBy: ''
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

    return (
        <div className="absolute w-full h-full bg-blue-700 bg-no-repeat bg-cover flex items-center justify-center">
            <Link to='/dashboard'>
                <ArrowBackIosIcon className="absolute top-6 left-6" style={{ color: "white" }} />
            </Link>
            <Container
                maxWidth="sm"
                className="bg-white bg-opacity-85 rounded-lg p-8 text-center w-[670px] h-[640px]"
            >
                <h1 className="mb-4 text-center" style={{ fontSize: "30px", fontFamily: "Poppins" }}>
                    Task Manager - {editingTask ? 'Edit Task' : 'New Task'}
                </h1>

                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity={snackbarSeverity}
                        variant="filled"
                        sx={{ width: '100%'}}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                    <TextField
                        required
                        id="title"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-1/2"
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
                        className="w-1/2"
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <FormControl className="w-1/2">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.priority}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                        {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
                    </FormControl>

                    <FormControl className="w-1/2">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.status}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Due Date"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            className="w-1/2"
                        />
                    </LocalizationProvider>
                    {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}

                    <TextField
                        required
                        id="createdBy"
                        label="Created By"
                        name="createdBy"
                        value={formData.createdBy}
                        InputProps={{ readOnly: true }}  // Set readOnly to true
                        className="w-1/2"
                        error={!!errors.createdBy}
                        helperText={errors.createdBy}
                    />

                    <Button type="submit" variant="contained" color="success" className="w-1/4">
                        {editingTask ? 'Update' : 'Add'} Task
                    </Button>
                </form>
            </Container>
        </div>
    );
}
