const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  weight: {
    type: Number, // in kg
  },
  height: {
    type: Number, // in cm
  },
  bmi: {
    type: Number, // auto-calculated
  },
  workoutLog: {
    type: String, // e.g. "Chest day: bench press 3x10, pushups 3x20"
  },
  notes: {
    type: String, // any personal notes
  },
  fitnessGoal: {
    type: String,
    enum: [
      "Weight Loss",
      "Muscle Gain",
      "Endurance",
      "Flexibility",
      "General Fitness",
    ],
  },
});

// Auto-calculate BMI before saving
progressSchema.pre("save", function (next) {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  next();
});

module.exports = mongoose.model("Progress", progressSchema);
