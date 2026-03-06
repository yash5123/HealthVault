const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addCheckup,
  getCheckups,
  markComplete,
  deleteCheckup,   // ✅ add this
  updateCheckup    // ✅ add this
} = require("../controllers/checkupController");

// Apply middleware properly
router.use(protect);

router.post("/", addCheckup);
router.get("/", getCheckups);
router.put("/:id", updateCheckup);
router.delete("/:id", deleteCheckup);
router.patch("/:id/complete", markComplete);

module.exports = router;