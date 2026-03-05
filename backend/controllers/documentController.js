const mongoose = require("mongoose");
const Document = require("../models/Document");

/* ================= UPLOAD DOCUMENT ================= */

const uploadDocument = async (req, res) => {
  try {

    console.log("UPLOAD BODY:", req.body);
    console.log("UPLOAD FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const document = await Document.create({
      title: req.body.title,
      type: req.body.type,
      fileUrl: req.file.path, // Cloudinary URL
      user: new mongoose.Types.ObjectId(req.user.id)
    });

    console.log("DOCUMENT SAVED:", document);

    res.status(201).json(document);

  } catch (err) {

    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= GET DOCUMENTS ================= */

const getDocuments = async (req, res) => {
  try {

    const documents = await Document.find({
      user: new mongoose.Types.ObjectId(req.user.id)
    }).sort({ createdAt: -1 });

    res.json(documents);

  } catch (err) {

    console.error("FETCH DOCUMENT ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= DELETE DOCUMENT ================= */

const deleteDocument = async (req, res) => {
  try {

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {

    console.error("DELETE DOCUMENT ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= EXPORT ================= */

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument
};