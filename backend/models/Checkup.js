const mongoose = require("mongoose");

const checkupSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true
    },

    doctorName: {
      type: String,
      required: true,
      trim: true
    },

    lastVisit: {
      type: Date,
      required: true
    },

    intervalMonths: {
      type: Number,
      required: true,
      min: 1
    },

    notes: {
      type: String,
      default: "",
      trim: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔥 Important for mark as complete
    completed: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Checkup", checkupSchema);