const express = require("express");
const {
  newMembership,
  getSingleMembership,
  myMemberships,
  getAllMemberships,
  updateMembership,
  deleteMembership,
} = require("../controllers/membershipController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/membership/new").post(isAuthenticatedUser, newMembership);
router.route("/membership/:id").get(isAuthenticatedUser, getSingleMembership);
router.route("/memberships/me").get(isAuthenticatedUser, myMemberships);
router
  .route("/admin/memberships")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllMemberships);
router
  .route("/admin/membership/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateMembership)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMembership);

module.exports = router;
