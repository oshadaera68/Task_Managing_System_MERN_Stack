const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

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
// app.options('*', cors(corsOptions));
app.use(express.json());

// ✅ Updated API Route Mounts to match Swagger
app.use("/api/tasks", task);
app.use("/api/login", signIn);
app.use("/api/register", signUp);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
});

// Start the server (except during testing)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Task application listening on port ${port}`);
    });
}

module.exports = app;
