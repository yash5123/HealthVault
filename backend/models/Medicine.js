const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= BASIC INFO ================= */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= DOSAGE ================= */

    dosageAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    dosageUnit: {
      type: String,
      enum: ["mg", "ml", "tablet", "capsule", "drops"],
      default: "mg",
    },

    /* ================= FREQUENCY ================= */

    frequencyPerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    /* ================= DURATION ================= */

    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },

    /* ================= STOCK ================= */

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    /* ================= SMART FIELDS ================= */

    totalRequired: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    reminderTimes: [String],
  },
  { timestamps: true }
);

/* ================= PRE SAVE LOGIC ================= */

medicineSchema.pre("save", function (next) {
  this.totalRequired =
    this.frequencyPerDay * this.durationDays;

  next();
});

module.exports = mongoose.model(
  "Medicine",
  medicineSchema
);