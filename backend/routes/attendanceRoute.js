const express = require("express");
const router = express.Router();
const {
  getTodayCheckinOptions,
  checkIn,
  getMyAttendance,
  getUserAttendanceAdmin,
} = require("../controllers/attendanceController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// User routes
router
  .route("/attendance/today")
  .get(isAuthenticatedUser, getTodayCheckinOptions);
router.route("/attendance/checkin").post(isAuthenticatedUser, checkIn);
router.route("/attendance/me").get(isAuthenticatedUser, getMyAttendance);

// Admin route
router
  .route("/admin/attendance/:userId")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserAttendanceAdmin);

module.exports = router;
