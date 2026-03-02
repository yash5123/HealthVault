const Medicine = require("../models/Medicine");

/* ================= GET ALL ================= */
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADD ================= */
const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK COMPLETE ================= */
const markComplete = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.completed = true;
    await medicine.save();

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  markComplete,
};