const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");
const authMiddleware = require("../middleware/auth");

// POST: Add income/expense
router.post("/", authMiddleware, async (req, res) => {
  const { type, amount, category } = req.body;
  try {
    const entry = await Finance.create({
      user: req.user.id,
      type,
      amount,
      category,
    });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to log transaction" });
  }
});

// GET: All transactions for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Finance.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

module.exports = router;
