const mongoose = require("mongoose");
const Document = require("../models/Document");

const uploadDocument = async (req, res) => {

  console.log("UPLOAD REQUEST BODY:", req.body);
  console.log("UPLOAD REQUEST FILE:", req.file);
  console.log("UPLOAD REQUEST USER:", req.user);

  try {

    /* ⭐ prevent filename crash */
    if (!req.file || !req.file.filename) {
      console.error("File missing from multer:", req.file);
      return res.status(400).json({
        message: "File upload failed. No file received."
      });
    }

    const document = await Document.create({
      title: req.body.title,
      type: req.body.type,
      fileUrl: `/uploads/${req.file.filename}`,
      user: new mongoose.Types.ObjectId(req.user.id)
    });

    console.log("DOCUMENT CREATED:", document);

    res.json(document);

  } catch (err) {

    console.error("DOCUMENT UPLOAD ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};

const getDocuments = async (req, res) => {

  try {

    console.log("FETCH DOCUMENTS USER:", req.user);

    const documents = await Document.find({
      user: new mongoose.Types.ObjectId(req.user.id)
    });

    res.json(documents);

  } catch (err) {

    console.error("FETCH DOCUMENTS ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};

const deleteDocument = async (req, res) => {

  try {

    console.log("DELETE DOCUMENT ID:", req.params.id);

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {

    console.error("DELETE DOCUMENT ERROR:");
    console.error(err);

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