const express = require("express");
const VaultItem = require("../models/VaultItem");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all vault items for a user
router.get("/", auth, async (req, res) => {
  try {
    const items = await VaultItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// POST a new vault item
router.post("/", auth, async (req, res) => {
  const { url, type, notes } = req.body;
  if (!url || !type) return res.status(400).json({ message: "URL and Type are required." });

  try {
    const item = await VaultItem.create({
      userId: req.user.id,
      url,
      type,
      notes
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error saving vault item" });
  }
});

module.exports = router;
