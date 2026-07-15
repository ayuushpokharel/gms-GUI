const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const errorMiddleware = require("./middleware/error");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Route Imports
const classRoute = require("./routes/classRoute");
const userRoute = require("./routes/userRoute");
const membershipRoute = require("./routes/membershipRoute");
const paymentRoute = require("./routes/paymentRoute");
const progressRoute = require("./routes/progressRoute");
const analyticsRoute = require("./routes/analyticsRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const settingsRoute = require("./routes/settingsRoute");

app.use("/api/v1", classRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", membershipRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", progressRoute);
app.use("/api/v1", analyticsRoute);
app.use("/api/v1", attendanceRoute);
app.use("/api/v1", settingsRoute);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
