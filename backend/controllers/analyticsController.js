const catchAsyncErrors = require("../middleware/catchAsyncError");
const Membership = require("../models/membershipModel");
const User = require("../models/userModel");
const Class = require("../models/classModel");

// GET /api/v1/admin/analytics
exports.getAnalytics = catchAsyncErrors(async (req, res, next) => {
  // ── Revenue by month (current year) ──────────────────────────────────────
  const currentYear = new Date().getFullYear();

  const revenueByMonth = await Membership.aggregate([
    {
      $match: {
        membershipStatus: "Active",
        paidAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$paidAt" },
        revenue: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill all 12 months (missing months = 0)
  const monthlyRevenue = Array(12).fill(0);
  const monthlyMemberships = Array(12).fill(0);
  revenueByMonth.forEach((item) => {
    monthlyRevenue[item._id - 1] = item.revenue;
    monthlyMemberships[item._id - 1] = item.count;
  });

  // ── Membership status breakdown ───────────────────────────────────────────
  const statusBreakdown = await Membership.aggregate([
    { $group: { _id: "$membershipStatus", count: { $sum: 1 } } },
  ]);

  // ── Plan breakdown ────────────────────────────────────────────────────────
  const planBreakdown = await Membership.aggregate([
    {
      $group: {
        _id: "$membershipPlan",
        count: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // ── User growth by month (current year) ──────────────────────────────────
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
        role: "user",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlyUsers = Array(12).fill(0);
  userGrowth.forEach((item) => {
    monthlyUsers[item._id - 1] = item.count;
  });

  // ── Top 5 classes by enrollment ───────────────────────────────────────────
  const topClasses = await Membership.aggregate([
    { $unwind: "$enrolledClasses" },
    {
      $group: {
        _id: "$enrolledClasses.gymClass",
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { enrollments: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "_id",
        as: "classDetails",
      },
    },
    { $unwind: "$classDetails" },
    {
      $project: {
        name: "$classDetails.name",
        category: "$classDetails.category",
        enrollments: 1,
      },
    },
  ]);

  // ── Summary totals ────────────────────────────────────────────────────────
  const totalRevenue = await Membership.aggregate([
    { $match: { membershipStatus: "Active" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalUsers = await User.countDocuments({ role: "user" });
  const totalTrainers = await User.countDocuments({ role: "trainer" });
  const totalClasses = await Class.countDocuments();
  const totalMemberships = await Membership.countDocuments();
  const activeMemberships = await Membership.countDocuments({
    membershipStatus: "Active",
  });

  res.status(200).json({
    success: true,
    analytics: {
      monthlyRevenue,
      monthlyMemberships,
      monthlyUsers,
      statusBreakdown,
      planBreakdown,
      topClasses,
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalTrainers,
        totalClasses,
        totalMemberships,
        activeMemberships,
      },
    },
  });
});
