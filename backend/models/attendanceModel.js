const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  classSession: {
    type: mongoose.Schema.ObjectId,
    ref: "ClassSession",
    required: true,
  },
  // Denormalized for fast breakdown/heatmap queries without populate()
  gymClass: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkedInAt: {
    type: Date,
    default: Date.now,
  },
});

// A member can only check in to a given session once
attendanceSchema.index({ user: 1, classSession: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
