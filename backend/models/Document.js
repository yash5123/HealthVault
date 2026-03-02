const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);