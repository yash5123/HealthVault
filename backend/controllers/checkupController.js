const mongoose = require("mongoose");
const Checkup = require("../models/Checkup");

const addCheckup = async (req, res) => {
  const checkup = await Checkup.create({
    ...req.body,
    user: new mongoose.Types.ObjectId(req.user.id)
  });

  res.json(checkup);
};

const getCheckups = async (req, res) => {
  const checkups = await Checkup.find({
    user: new mongoose.Types.ObjectId(req.user.id),
    completed: false
  });

  res.json(checkups);
};

const markComplete = async (req, res) => {
  const checkup = await Checkup.findOneAndUpdate(
    {
      _id: req.params.id,
      user: new mongoose.Types.ObjectId(req.user.id)
    },
    { completed: true },
    { new: true }
  );

  res.json(checkup);
};

const updateCheckup = async (req, res) => {
  const checkup = await Checkup.findOneAndUpdate(
    {
      _id: req.params.id,
      user: new mongoose.Types.ObjectId(req.user.id)
    },
    req.body,
    { new: true }
  );

  res.json(checkup);
};

const deleteCheckup = async (req, res) => {
  await Checkup.findOneAndDelete({
    _id: req.params.id,
    user: new mongoose.Types.ObjectId(req.user.id)
  });

  res.json({ message: "Checkup deleted successfully" });
};

module.exports = {
  addCheckup,
  getCheckups,
  markComplete,
  updateCheckup,
  deleteCheckup
};