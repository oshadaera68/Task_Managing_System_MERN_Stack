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
  IconButton, Select, MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
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
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const role = formData.role.trim().toLowerCase();

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
      const response = await axios.post("https://tms-backend-7mx2.onrender.com/api/register", {
        name, email, password, role,
      });
      console.log(response.data)

      setShowSnackbar({ open: true, message: "Signup successful!" });

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
          className="flex items-center justify-center min-h-screen bg-black/70 bg-no-repeat bg-cover px-4"
          style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <Container
            maxWidth="sm"
            className="bg-white rounded-xl bg-opacity-90 w-full max-w-md p-6 sm:p-10 shadow-lg"
        >
          <h1 className="text-xl sm:text-3xl font-semibold text-center mb-6 font-[Poppins]">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <TextField
                required
                id="name"
                label="Name"
                name="name"
                className="w-full max-w-sm"
                value={formData.name}
                onChange={handleChange}
            />

            <TextField
                required
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                className="w-full max-w-sm"
                value={formData.email}
                onChange={handleChange}
            />

            <FormControl variant="outlined" className="w-full max-w-sm">
              <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
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

            {/*<TextField*/}
            {/*    required*/}
            {/*    id="role"*/}
            {/*    label="Role"*/}
            {/*    name="role"*/}
            {/*    className="w-full max-w-sm"*/}
            {/*    value={formData.role}*/}
            {/*    onChange={handleChange}*/}
            {/*/>*/}

            <FormControl error={!!errors.role} className="w-full max-w-sm">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  variant="outlined"

              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-1/2 max-w-sm"
                disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <br/>
          <Typography variant="body2" align="center" className="mt-4 font-roboto">
            Already have an account?{" "}
            <br/>
            <Link to="/login" className="text-blue-600">
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
