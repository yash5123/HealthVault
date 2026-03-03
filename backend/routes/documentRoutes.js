const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDocuments,
  uploadDocument,
} = require("../controllers/documentController");

router.get("/", protect, getDocuments);
router.post("/", protect, uploadDocument);

module.exports = router;