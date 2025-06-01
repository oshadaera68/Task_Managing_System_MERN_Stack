import React, { useState } from 'react';
import {
    AppBar, Box, Button, Toolbar, Typography, Dialog, DialogActions,
    DialogTitle
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext'; // Import your context

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => setOpen(true);

    const confirmLogout = () => {
        logout();
        setOpen(false);
        navigate('/login');
    };

    return (
        <>
            {/*Navigation Bar*/}
            <div className="absolute w-full h-full bg-blue-300 bg-cover bg-no-repeat">
                <Box sx={{ flexGrow: 1 }} style={{backgroundColor: 'black'}}>
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
                                    <Link to="/login"><Button color="inherit">Login</Button></Link>
                                </>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Are you sure about the logout?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>No</Button>
                        <Button onClick={confirmLogout} autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
