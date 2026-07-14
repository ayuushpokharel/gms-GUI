const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router
  .route("/admin/analytics")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAnalytics);

module.exports = router;
