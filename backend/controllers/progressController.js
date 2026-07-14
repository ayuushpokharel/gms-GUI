const Progress = require("../models/progressModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Add a new progress entry — POST /api/v1/progress/new
exports.addProgress = catchAsyncErrors(async (req, res, next) => {
  const { weight, height, workoutLog, notes, fitnessGoal } = req.body;

  const progress = await Progress.create({
    user: req.user._id,
    weight,
    height,
    workoutLog,
    notes,
    fitnessGoal,
  });

  res.status(201).json({
    success: true,
    progress,
  });
});

// Get all progress entries for logged-in user — GET /api/v1/progress/me
exports.getMyProgress = catchAsyncErrors(async (req, res, next) => {
  const progressEntries = await Progress.find({ user: req.user._id }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    count: progressEntries.length,
    progressEntries,
  });
});

// Get single progress entry — GET /api/v1/progress/:id
exports.getProgressDetails = catchAsyncErrors(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return next(new ErrorHandler("Progress entry not found", 404));
  }

  // ensure user can only see their own
  if (progress.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view this entry", 403));
  }

  res.status(200).json({
    success: true,
    progress,
  });
});

// Update a progress entry — PUT /api/v1/progress/:id
exports.updateProgress = catchAsyncErrors(async (req, res, next) => {
  let progress = await Progress.findById(req.params.id);

  if (!progress) {
    return next(new ErrorHandler("Progress entry not found", 404));
  }

  if (progress.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this entry", 403));
  }

  progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    progress,
  });
});

// Delete a progress entry — DELETE /api/v1/progress/:id
exports.deleteProgress = catchAsyncErrors(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return next(new ErrorHandler("Progress entry not found", 404));
  }

  if (progress.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this entry", 403));
  }

  await progress.deleteOne();

  res.status(200).json({
    success: true,
    message: "Progress entry deleted",
  });
});

// Admin: get all progress entries for a specific user — GET /api/v1/admin/progress/:userId
exports.getUserProgressAdmin = catchAsyncErrors(async (req, res, next) => {
  const progressEntries = await Progress.find({ user: req.params.userId }).sort(
    { date: -1 },
  );

  res.status(200).json({
    success: true,
    count: progressEntries.length,
    progressEntries,
  });
});
