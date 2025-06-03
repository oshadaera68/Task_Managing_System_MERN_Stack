const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const task = require("./Routes/task");
const signIn = require("./Routes/signin");
const signUp = require("./Routes/signup");

// Allowed origins for CORS
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tms-frontend-lz4xdiu4x-era-boys-projects.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// ✅ API routes
app.use("/api/tasks", task);
app.use("/api/login", signIn);
app.use("/api/register", signUp);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Global Error:", err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
});

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
})
    .then(() => {
        console.log("✅ Connected to MongoDB");

        if (process.env.NODE_ENV !== 'test') {
            app.listen(port, () => {
                console.log(`🚀 Task application listening on port ${port}`);
            });
        }
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Exit app if DB connection fails
    });

module.exports = app;
