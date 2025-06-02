import React, {useState} from 'react';
import {Container, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function CrudPage() {

    const [formData, setFormData] = React.useState({
        title: '', description: '', priority: '', status: '', dueDate: '', createdBy: ''
    });
    const [currentTask, setCurrentTask] = useState(null);
    const [value, setValue] = React.useState(dayjs('2025-04-17'));

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData, [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted:", formData);
    };

    return (<div className="absolute w-full h-full bg-blue-700 bg-no-repeat bg-cover flex items-center justify-center">
        <Container
            maxWidth="sm"
            className="bg-white bg-opacity-85 rounded-lg p-8 text-center w-[670px] h-[640px]"
        >
            <h1 className="mb-4 text-center" style={{fontSize: "30px", fontFamily: "Poppins"}}>
                Task Manager - {currentTask ? 'Edit Task' : 'New Task'}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                <TextField
                    required
                    id="title"
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-1/2"
                />

                <TextField
                    required
                    id="description"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-1/2"
                />

                <FormControl className="w-1/2">
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                        labelId="priority-label"
                        id="priority"
                        name="priority" // ✅ Required for state update
                        value={formData.priority}
                        onChange={handleChange}
                        variant="outlined">
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className="w-1/2">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status" // ✅ Required for state update
                        value={formData.status}
                        onChange={handleChange}
                        variant="outlined">
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs} className="w-1/2">
                <DatePicker
                    label="Due Date"
                    name="dueDate"
                    value={value || formData.dueDate}
                    onChange={(newValue) => setValue(newValue)}
                />
                </LocalizationProvider>

                <TextField
                    required
                    id="createdby"
                    label="Created By"
                    name="createdby"
                    value={formData.createdBy}
                    onChange={handleChange}
                    className="w-1/2"
                />
            </form>
        </Container>
    </div>);
}
