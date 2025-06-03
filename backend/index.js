const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
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

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://tms-frontend-lz4xdiu4x-era-boys-projects.vercel.app/"];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // ✅ allow cookies/auth headers
};

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

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Task application listening on port ${port}`);
    });
}

module.exports = app; // <- ✅ Export app for Supertest
