const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST new task (goal)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, deadline } = req.body;
    if (!title || !deadline) {
      return res
        .status(400)
        .json({ message: "Title and deadline are required" });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid deadline format" });
    }

    const goal = await Goal.create({
      title,
      deadline: deadlineDate,
      status: "Pending",
      user: req.user.id,
    });

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// GET all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// PATCH update task
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// DELETE task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Goal.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
