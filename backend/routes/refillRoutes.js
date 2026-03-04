const express = require("express");
const router = express.Router();
const Refill = require("../models/refillHistoryModel");

/* ================= GET REFILL HISTORY ================= */

router.get("/", async (req, res) => {
  try {
    const refills = await Refill.find().sort({ createdAt: -1 });
    res.json(refills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD REFILL ================= */

router.post("/", async (req, res) => {
  try {

    const { medicineId, name, amount, action } = req.body;

    const refill = new Refill({
      medicineId,
      name,
      amount,
      action,
      date: new Date()
    });

    const saved = await refill.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;