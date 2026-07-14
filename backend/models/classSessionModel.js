const mongoose = require("mongoose");

// A ClassSession is one dated occurrence of a recurring Class
// (Class.schedule only describes the weekly pattern, e.g. "Monday 6pm" —
// a ClassSession is the concrete instance on an actual calendar date,
// which is what attendance gets recorded against).
const classSessionSchema = new mongoose.Schema({
  gymClass: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
    required: true,
  },
  // Stored at midnight UTC for the calendar day this session falls on,
  // so sessions can be looked up/deduped by (gymClass, date) per day.
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // e.g. "18:00", copied from Class.schedule.time at creation
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// One session per class per calendar day
classSessionSchema.index({ gymClass: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ClassSession", classSessionSchema);
