    import React, {useState} from 'react';
    import wallpaper from "../../assets/login.jpg";
    import {
        Button,
        Container,
        FormControl,
        IconButton,
        InputAdornment,
        InputLabel,
        OutlinedInput,
        Snackbar,
        TextField,
        Typography,
    } from "@mui/material";
    import Visibility from "@mui/icons-material/Visibility";
    import VisibilityOff from "@mui/icons-material/VisibilityOff";
    import {Link, useNavigate} from "react-router-dom";
    import axios from "axios";
    
    export default function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [snackbarMessage, setSnackbarMessage] = useState("");
        const [showSnackbar, setShowSnackbar] = useState(false);
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
    
        const [showPassword, setShowPassword] = useState(false);
    
        const handleClickShowPassword = () => setShowPassword((show) => !show);
    
        const handleMouseDownPassword = (event) => {
            event.preventDefault();
        };
    
        const handleMouseUpPassword = (event) => {
            event.preventDefault();
        };
    
        const validateEmail = (email) => {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(email);
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            if (!email || !password) {
                setSnackbarMessage("Please fill in all the fields.");
                setShowSnackbar(true);
                return;
            }
    
            if (!validateEmail(email)) {
                setSnackbarMessage("Invalid email format.");
                setShowSnackbar(true);
                return;
            }
    
            if (password.length < 6) {
                setSnackbarMessage("Password must be at least 6 characters.");
                setShowSnackbar(true);
                return;
            }
    
            setLoading(true);
    
            try {
                const response = await axios.post("http://localhost:4000/signin", {
                    email, password,
                });
    
                console.log("Logged in successfully!");
                console.log("User token:", response.data.token);
    
                // Store token (adjust if your API response structure is different)
                localStorage.setItem('token', response.data.token);
    
                // Navigate to dashboard
                navigate("/dashboard");
            } catch (error) {
                console.error("Error while logging in:", error.response?.data || error.message);
    
                if (error.response && error.response.status === 401) {
                    setSnackbarMessage("Invalid credentials. Please try again.");
                } else {
                    setSnackbarMessage("Login failed. Please try again later.");
                }
                setShowSnackbar(true);
                setPassword(""); // Clear password field on error
            } finally {
                setLoading(false);
            }
        };
    
        return (<div
                className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-black/50'
                style={{backgroundImage: `url(${wallpaper})`}}
            >
                <Container maxWidth="sm" className="bg-white bg-opacity-80 rounded-lg p-8 text-center w-[650px] h-[390px]">
                    <h1 className="mb-4 text-center" style={{fontSize: "34px", fontFamily: "Poppins"}}>
                        Login
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            required
                            autoFocus
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            className="w-1/2 mb-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <br/>
                        <br/>
                        <FormControl variant="outlined" className="w-1/2 mb-3">
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password *
                            </InputLabel>
                            <OutlinedInput
                                id="password"
                                name="password"
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? "hide the password" : "show the password"}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>}
                                label="Password"
                            />
                        </FormControl>
                        <br/>
                        <br/>
                        <Button variant="contained" type="submit" color="primary" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    <br/>
                    <Typography variant="body2" align="center" className="mt-2" style={{fontFamily: 'Roboto'}}>
                        Don't have an account?
                        <br/>
                        <Link to="/register" style={{color: "blue"}}>
                            Sign up
                        </Link>
                    </Typography>
                </Container>
    
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={4000}
                    onClose={() => setShowSnackbar(false)}
                    message={snackbarMessage}
                    className="fixed bottom-0 right-0 mb-8 mr-8"
                />
            </div>);
    }
