const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/settings").get(getSettings);
router
  .route("/admin/settings")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateSettings);

module.exports = router;
