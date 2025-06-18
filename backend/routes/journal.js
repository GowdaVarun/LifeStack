const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// GET /api/journal — fetch user’s journal entries
router.get("/", verifyToken, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});

// POST /api/journal — save new entry
router.post("/", verifyToken, async (req, res) => {
  const { text, mood } = req.body;
  if (!text || !mood) return res.status(400).json({ message: "Text and mood required" });

  try {
    const entry = await Journal.create({
      user: req.userId,
      text,
      mood
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to save entry" });
  }
});

module.exports = router;
