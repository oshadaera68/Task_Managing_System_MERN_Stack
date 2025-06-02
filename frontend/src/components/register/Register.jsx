import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper.jpg";
import {
  Container,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Typography,
  Snackbar,
  FormControl,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  // UseStates
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim and normalize data
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const role = formData.role.trim().toLowerCase();

    // Validate inputs
    if (!name || !email || !password || !role) {
      setShowSnackbar({ open: true, message: "Please fill in all the fields" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShowSnackbar({ open: true, message: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      setShowSnackbar({ open: true, message: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name,
        email,
        password,
        role,
      });

      console.log("Signup successful!", response.data);
      setShowSnackbar({ open: true, message: "Signup successful!" });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error during signup:", error);
      setShowSnackbar({ open: true, message: "Signup failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
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
              className="relative mb-3.5 text-center"
              style={{ fontSize: "34px", fontFamily: "Poppins", top: "5px" }}
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
                          aria-label={showPassword ? "hide the password" : "show the password"}
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
                name="role"
                className="w-1/2 mb-3"
                value={formData.role}
                onChange={handleChange}
            />
            <br />
            <Button type="submit" variant="contained" className="mt-2" sx={{ py: 1 }} disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <br />
          <Typography
              variant="body2"
              align="center"
              className="mt-2"
              style={{ fontFamily: "Roboto", top: "7vh" }}
          >
            Already have an Account?
            <br />
            <Link to="/login" className="text-primary" style={{ color: "blue" }}>
              {" "}
              Sign In
            </Link>
          </Typography>
        </Container>
        <Snackbar
            open={showSnackbar.open}
            autoHideDuration={4000}
            message={showSnackbar.message}
            onClose={() => setShowSnackbar({ ...showSnackbar, open: false })}
            className="fixed bottom-0 right-0 mb-8 mr-8"
        />
      </div>
  );
}
