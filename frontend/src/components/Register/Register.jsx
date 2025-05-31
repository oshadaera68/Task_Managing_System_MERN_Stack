import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper.jpg";
import {
  Container,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button, Typography, Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

export default function Register() {
  // UseStates
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setShowSnackbar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen bg-black bg-no-repeat bg-cover bg-opacity-90"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <Container
          maxWidth="sm"
          className="bg-white rounded-lg bg-opacity-90 w-[900px] h-[500px]"
          style={{ alignItems: "center" }}
        >
          <h1
            className="mb-4 text-center"
            style={{ fontSize: "34px", fontFamily: "Poppins" }}
          >
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <TextField
              required
              autoFocus
              id="name"
              label="Name"
              name="name"
              className="w-1/2 mb-3"
              value={formData.name}
              onChange={handleChange}
            />
            <br />
            <TextField
              required
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              className="w-1/2 mb-3"
              value={formData.email}
              onChange={handleChange}
            />
            <br />
            <FormControl variant="outlined" className="w-1/2 mb-3">
              <InputLabel htmlFor="outlined-adornment-password">
                Password *
              </InputLabel>
              <OutlinedInput
                  id="password"
                  name="password"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <br />
            <TextField
              required
              id="role"
              label="Role"
              className="w-1/2 mb-3"
              value={formData.role}
              onChange={handleChange}
            />
            <br />
            <Link to='/login'>
              <Button
                variant="contained"
                className="mt-2"
                sx={{ py: 1 }}
                fullWidth
              >
                Sign Up
              </Button>
            </Link>
          </form>
          <br />
          <Typography variant="body2" align="center" className="mt-2" style={{ fontFamily: 'Poppins' }}>
           Already have an Account?
            <br/>
            <Link to="/login" className="text-primary" style={{ color: "blue" }}>
              {" "}
              Sign In
            </Link>
          </Typography>
        </Container>
        <Snackbar
            open={showSnackbar}
            autoHideDuration={4000}
            message="Please fill in all the fields"
            className="fixed bottom-0 right-0 mb-8 mr-8"
            onClose={() => setShowSnackbar(false)}
        />
      </div>
    </>
  );
}