const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  // Health info = shipping info equivalent
  healthInfo: {
    height: { type: Number, required: true }, // cm
    weight: { type: Number, required: true }, // kg
    fitnessGoal: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    phone: { type: String, required: true },
  },
  // Classes enrolled in = order items equivalent
  enrolledClasses: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }, // sessions per week
      image: { type: String, required: true },
      gymClass: {
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true,
      },
    },
  ],
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date, required: true },
  // Membership plan selected
  membershipPlan: {
    type: String,
    required: true,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic",
  },
  // Duration in months
  duration: {
    type: Number,
    required: true,
    enum: [1, 3, 6, 12],
    default: 1,
  },
  // Price breakdown (mirrors e-shop order exactly)
  classesPrice: { type: Number, default: 0 }, // itemsPrice equivalent
  facilityFee: { type: Number, default: 0 }, // taxPrice equivalent
  processingFee: { type: Number, default: 0 }, // shippingPrice equivalent
  totalPrice: { type: Number, default: 0 },
  // Status: Processing → Active → Expired
  membershipStatus: {
    type: String,
    required: true,
    default: "Processing",
    enum: ["Processing", "Active", "Expired"],
  },
  activatedAt: Date, // deliveredAt equivalent
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Membership", membershipSchema);
