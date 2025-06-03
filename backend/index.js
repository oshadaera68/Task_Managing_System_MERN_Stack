const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // Changed from 3000 to 4000
const cors = require("cors");

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const task = require("./Routes/task");
const signIn = require("./Routes/signin");
const signUp = require("./Routes/signup");

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
});

// Routes
app.use("/task", task);
app.use("/signin", signIn);
app.use("/signup", signUp);

app.listen(port, () => {
    console.log(`Task application listening on port ${port}`);
});
