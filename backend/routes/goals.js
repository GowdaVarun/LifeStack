const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST new goal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user.id });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error creating goal" });
  }
});

// GET all goals
router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching goals" });
  }
});

// PATCH update goal
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error updating goal" });
  }
});

// DELETE goal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Goal.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting goal" });
  }
});

module.exports = router;
