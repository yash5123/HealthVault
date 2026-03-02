const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;