const express = require("express");
const router = express.Router();

const {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  markComplete,
} = require("../controllers/medicineController");

const { protect } = require("../middleware/authMiddleware");

// All routes protected
router.use(protect);

// GET all medicines
router.get("/", getMedicines);

// ADD medicine
router.post("/", addMedicine);

// UPDATE medicine
router.put("/:id", updateMedicine);

// DELETE medicine
router.delete("/:id", deleteMedicine);

// MARK COMPLETE
router.put("/:id/complete", markComplete);
  
module.exports = router;