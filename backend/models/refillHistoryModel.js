const mongoose = require("mongoose");

const refillHistorySchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  action: {
    type: String,
    enum: ["ADD", "REDUCE"],
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("RefillHistory", refillHistorySchema);