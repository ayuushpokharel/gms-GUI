const express = require("express");
const router = express.Router();
const {
  addProgress,
  getMyProgress,
  getProgressDetails,
  updateProgress,
  deleteProgress,
  getUserProgressAdmin,
} = require("../controllers/progressController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// User routes
router.route("/progress/new").post(isAuthenticatedUser, addProgress);
router.route("/progress/me").get(isAuthenticatedUser, getMyProgress);
router
  .route("/progress/:id")
  .get(isAuthenticatedUser, getProgressDetails)
  .put(isAuthenticatedUser, updateProgress)
  .delete(isAuthenticatedUser, deleteProgress);

// Admin route
router
  .route("/admin/progress/:userId")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserProgressAdmin);

module.exports = router;
