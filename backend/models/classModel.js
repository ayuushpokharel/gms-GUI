const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Class Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Class Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Class Price per Session"],
    maxlength: [8, "Price cannot exceed 8 characters"],
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Class Category"],
    enum: [
      "Yoga",
      "Cardio",
      "Strength Training",
      "Zumba",
      "CrossFit",
      "Pilates",
      "Martial Arts",
      "Other",
    ],
  },
  // "Stock" in e-shop = "capacity" in GMS (max number of trainees)
  capacity: {
    type: Number,
    required: [true, "Please Enter Class Capacity"],
    default: 20,
    maxlength: [4, "Capacity can't exceed 4 characters"],
  },
  // Schedule info
  schedule: {
    day: {
      type: String,
      required: [true, "Please Enter Class Day"],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Daily",
        "Weekdays",
        "Weekends",
      ],
    },
    time: {
      type: String,
      required: [true, "Please Enter Class Time"],
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Please Enter Duration in minutes"],
      default: 60,
    },
  },
  // Required membership to join this class
  requiredMembership: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic",
  },
  // Trainer assigned to this class (ref to User with role trainer)
  trainer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please Assign a Trainer"],
  },
  // Reviews (same structure as e-shop)
  numofReviews: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  ratings: { type: Number, default: 0 },
  // Created by admin
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Class", classSchema);
