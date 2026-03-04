const express = require("express");
const router = express.Router();
const RefillHistory = require("../models/refillHistoryModel");

router.get("/", async (req, res) => {

  const history = await RefillHistory
    .find()
    .sort({ date: -1 })
    .limit(50);

  res.json(history);

});


router.post("/", async (req, res) => {

  const history = await RefillHistory.create(req.body);

  res.json(history);

});

module.exports = router;