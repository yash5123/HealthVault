const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const { protect } = require("../middleware/authMiddleware");
const {
  getDocuments,
  uploadDocument,
  deleteDocument
} = require("../controllers/documentController");

/* ================= CLOUDINARY STORAGE ================= */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "healthvault_documents",
    resource_type: "raw" // allows PDF upload
  }
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

router.get("/", protect, getDocuments);

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadDocument
);

router.delete("/:id", protect, deleteDocument);

module.exports = router;