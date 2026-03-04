const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // ⭐ added

const { protect } = require("../middleware/authMiddleware");
const {
  getDocuments,
  uploadDocument,
  deleteDocument
} = require("../controllers/documentController");

/* ================= MULTER CONFIG ================= */

/* ⭐ ensure uploads folder exists (Render fix) */

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

/* ⭐ Added safe config but kept everything else */

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error("No file received"));
    }
    cb(null, true);
  }
});

/* ================= ROUTES ================= */

router.get("/", protect, getDocuments);

router.post(
  "/",
  protect,
  upload.single("file"),   // field name must match frontend FormData
  uploadDocument
);

router.delete("/:id", protect, deleteDocument);

module.exports = router;