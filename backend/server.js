// GMS - Gym Management System

const path = require("path");
const dotenv = require("dotenv");

// Load .env first, before any other require
dotenv.config({ path: path.join(__dirname, "config/.env") });

// Config — validates and exports all env vars as named constants
const {
    PORT,
    DB_URI,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = require("./config/env.config");

const app = require("./app");
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Connecting to database
const connectDatabase = require("./config/database");
connectDatabase();

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
    console.log(`Server is Up and running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});
