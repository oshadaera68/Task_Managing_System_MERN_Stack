const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Debug check
if (!process.env.MONGO_URL) {
    console.error("❌ MONGO_URL is not defined in your .env file");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

app.listen(port, () => {
    console.log(`🚀 Task application listening on port ${port}`);
});
