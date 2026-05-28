const express = require("express");
const {
  getAllClasses,
  createClass,
  getClassDetails,
  updateClass,
  deleteClass,
  createClassReview,
  getClassReviews,
  deleteReview,
  getAdminClasses,
} = require("../controllers/classController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/classes").get(getAllClasses);
router
  .route("/admin/classes")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminClasses);
router
  .route("/admin/class/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createClass);
router.route("/class/:id").get(getClassDetails);
router
  .route("/admin/class/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateClass)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteClass);
router.route("/review").put(isAuthenticatedUser, createClassReview);
router
  .route("/reviews")
  .get(getClassReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
