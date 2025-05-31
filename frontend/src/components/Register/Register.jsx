import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper.jpg";
import {
  Container,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

function Register() {
  // UseStates
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {};

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen bg-black bg-no-repeat bg-cover bg-opacity-90"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <Container
          maxWidth="sm"
          className="bg-white rounded-lg bg-opacity-90 w-[1000px] h-[700px]"
        >
          <h1
            className="mb-4 text-center"
            style={{ fontSize: "34px", fontFamily: "Poppins" }}
          >
            Register
          </h1>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              id="outlined-required"
              label="Name"
              className="w-full mb-4"
            />
            <br />
            <br />
            <TextField
              required
              id="outlined-required"
              label="Email"
              className="w-full mb-4"
            />
            <br />
            <br />
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
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
          </form>
        </Container>
      </div>
    </>
  );
}
export default Register;
