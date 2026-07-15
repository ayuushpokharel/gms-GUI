const Settings = require("../models/settingsModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");

// GET /api/v1/settings  — public, used by payment page to fetch QR
exports.getSettings = catchAsyncError(async (req, res, next) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  res.status(200).json({ success: true, settings });
});

// PUT /api/v1/admin/settings  — admin only, upload eSewa QR
exports.updateSettings = catchAsyncError(async (req, res, next) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});

  const { esewaQR, esewaNumber } = req.body;

  if (esewaNumber !== undefined) {
    settings.esewaNumber = esewaNumber;
  }

  if (esewaQR && esewaQR !== "") {
    // Delete old QR from Cloudinary if it exists
    if (settings.esewaQR && settings.esewaQR.public_id) {
      await cloudinary.v2.uploader.destroy(settings.esewaQR.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(esewaQR, {
      folder: "gms/esewa",
    });

    settings.esewaQR = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  settings.updatedAt = Date.now();
  await settings.save();

  res.status(200).json({ success: true, settings });
});
