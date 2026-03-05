const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addCheckup,
  getCheckups,
  markComplete
} = require("../controllers/checkupController");

// Apply middleware properly
router.use(protect);
router.delete("/:id", deleteCheckup);
router.put("/:id", updateCheckup);
router.post("/", addCheckup);
router.get("/", getCheckups);
router.patch("/:id/complete", markComplete);

module.exports = router;