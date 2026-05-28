const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Name can't exceed 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  // role: "user" = trainee, "trainer" = trainer, "admin" = admin
  role: {
    type: String,
    default: "user",
    enum: ["user", "trainer", "admin"],
  },
  // Trainee-specific fields
  phone: { type: String },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  fitnessGoal: {
    type: String,
    enum: [
      "Weight Loss",
      "Muscle Gain",
      "Flexibility",
      "Endurance",
      "General Fitness",
      "",
    ],
    default: "",
  },
  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", ""],
    default: "",
  },
  membershipType: {
    type: String,
    enum: ["None", "Basic", "Standard", "Premium"],
    default: "None",
  },
  membershipExpiry: { type: Date },
  // Trainer-specific fields
  specialization: { type: String },
  bio: { type: String },
  experience: { type: Number }, // years of experience
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
