const mongoose = require("mongoose");
const Document = require("../models/Document");

const uploadDocument = async (req, res) => {

  try {

    console.log("UPLOAD BODY:", req.body);
    console.log("UPLOAD FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication failed"
      });
    }

    const document = await Document.create({
      title: req.body.title,
      type: req.body.type,
      fileUrl: req.file.path,   // Cloudinary URL
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

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument
};