const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    dosage: String,
    frequency: String,
    reminderTimes: [String],
    quantity: Number,
    lowStockThreshold: Number,
    startDate: Date,
    endDate: Date,
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);