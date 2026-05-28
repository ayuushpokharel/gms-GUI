const Membership = require("../models/membershipModel");
const Class = require("../models/classModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { updateCapacity } = require("./classController");

// Create new Membership
exports.newMembership = catchAsyncError(async (req, res, next) => {
  const {
    healthInfo,
    enrolledClasses,
    membershipPlan,
    duration,
    paymentInfo,
    classesPrice,
    facilityFee,
    processingFee,
    totalPrice,
    paidAt,
  } = req.body;

  // Validate capacity for each enrolled class
  for (const item of enrolledClasses) {
    const gymClass = await Class.findById(item.gymClass);
    if (!gymClass) {
      return next(new ErrorHandler(`Class not found: ${item.gymClass}`, 404));
    }
    if (gymClass.capacity < item.quantity) {
      return next(
        new ErrorHandler(
          `Not enough capacity in class: ${gymClass.name}`,
          400
        )
      );
    }

    // Check membership plan access
    const planRank = { Basic: 1, Standard: 2, Premium: 3 };
    if (planRank[membershipPlan] < planRank[gymClass.requiredMembership]) {
      return next(
        new ErrorHandler(
          `Your ${membershipPlan} plan does not allow enrollment in ${gymClass.name}. Required: ${gymClass.requiredMembership}`,
          400
        )
      );
    }
  }

  const membership = await Membership.create({
    healthInfo,
    enrolledClasses,
    membershipPlan,
    duration,
    paymentInfo,
    classesPrice,
    facilityFee,
    processingFee,
    totalPrice,
    paidAt,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    membership,
  });
});

// Get Single Membership
exports.getSingleMembership = catchAsyncError(async (req, res, next) => {
  const membership = await Membership.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!membership) {
    return next(new ErrorHandler("Membership not found", 404));
  }

  res.status(200).json({
    success: true,
    membership,
  });
});

// Get Logged in user Memberships
exports.myMemberships = catchAsyncError(async (req, res, next) => {
  const memberships = await Membership.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    memberships,
  });
});

// Get all Memberships -- Admin
exports.getAllMemberships = catchAsyncError(async (req, res, next) => {
  const memberships = await Membership.find().populate("user", "name email");

  let totalAmount = 0;

  memberships.forEach((membership) => {
    totalAmount += membership.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    memberships,
  });
});

// Update Membership Status -- Admin
exports.updateMembership = catchAsyncError(async (req, res, next) => {
  const membership = await Membership.findById(req.params.id);

  if (!membership) {
    return next(new ErrorHandler("Membership not found", 404));
  }

  if (membership.membershipStatus === "Expired") {
    return next(
      new ErrorHandler("This membership has already expired", 400)
    );
  }

  if (req.body.status === "Active" && membership.membershipStatus !== "Active") {
    for (const c of membership.enrolledClasses) {
      await updateCapacity(c.gymClass, c.quantity);
    }
    membership.activatedAt = Date.now();

    // Update user's membership type and expiry
    await User.findByIdAndUpdate(membership.user, {
      membershipType: membership.membershipPlan,
      membershipExpiry: new Date(
        Date.now() + membership.duration * 30 * 24 * 60 * 60 * 1000
      ),
    });
  }

  membership.membershipStatus = req.body.status;

  await membership.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Delete Membership -- Admin
exports.deleteMembership = catchAsyncError(async (req, res, next) => {
  const membership = await Membership.findById(req.params.id);

  if (!membership) {
    return next(new ErrorHandler("Membership not found", 404));
  }

  await Membership.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Membership Deleted Successfully",
  });
});
