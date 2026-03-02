const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  dosage: String,
  frequency: String,
  reminderTimes: [String],
  quantity: Number,
  lowStockThreshold: Number,
  startDate: Date,
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);