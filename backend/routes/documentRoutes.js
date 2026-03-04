const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { protect } = require("../middleware/authMiddleware");
const {
  getDocuments,
  uploadDocument,
  deleteDocument
} = require("../controllers/documentController");

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

router.get("/", protect, getDocuments);

router.post(
  "/",
  protect,
  upload.single("file"), // IMPORTANT
  uploadDocument
);

router.delete("/:id", protect, deleteDocument);

module.exports = router;