import React, {useState} from 'react'
import wallpaper from "../../assets/login.jpg";
import {Button, Container, Snackbar, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = () => {

    }

    const handleCloseSnackbar = () => {
        setIsError(false);
    };

    return (<div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-black/50'
                 style={{backgroundImage: `url(${wallpaper})`}}>
            <Container maxWidth="sm" className="bg-white bg-opacity-80 rounded-lg p-8 text-center w-[650px] h-[390px]">
                <h1
                    className="mb-4 text-center"
                    style={{fontSize: "34px", fontFamily: "Poppins"}}
                >
                    Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        className="w-1/2 mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        required
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        className="w-1/2 mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br/>
                    <br/>
                    <Link to='/'>
                        <Button variant="contained" type="submit" color="primary">Login</Button>
                    </Link>
                </form>
                <br />
                <Typography variant="body2" align="center" className="mt-2" style={{ fontFamily: 'Roboto' }}>
                    Don't have an account?
                    <br/>
                    <Link to="/register" className="text-primary" style={{ color: "blue" }}>
                        {" "}
                        Sign Up
                    </Link>
                </Typography>
            </Container>

        <Snackbar
            open={isError}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            message="Please fill in all the fields"
            className="fixed bottom-0 right-0 mb-8 mr-8"
        />
        </div>);
}