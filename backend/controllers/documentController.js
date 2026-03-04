const mongoose = require("mongoose");
const Document = require("../models/Document");

const uploadDocument = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const document = await Document.create({
      title: req.body.title,
      type: req.body.type,
      fileUrl: `/uploads/${req.file.filename}`,
      user: new mongoose.Types.ObjectId(req.user.id)
    });

    res.json(document);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDocuments = async (req, res) => {

  const documents = await Document.find({
    user: new mongoose.Types.ObjectId(req.user.id)
  });

  res.json(documents);
};

const deleteDocument = async (req, res) => {

  await Document.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument
};