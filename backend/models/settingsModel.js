const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  esewaQR: {
    public_id: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  esewaNumber: { type: String, default: "" }, // e.g. 98XXXXXXXX
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settings", settingsSchema);
