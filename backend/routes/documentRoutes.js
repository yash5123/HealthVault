const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getDocuments,
  uploadDocument,
  deleteDocument
} = require("../controllers/documentController");

router.use(protect);

router.post("/", uploadDocument);
router.get("/", getDocuments);
router.delete("/:id", deleteDocument);

module.exports = router;