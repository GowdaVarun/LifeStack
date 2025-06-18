const mongoose = require("mongoose");

const vaultItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["Article", "Video", "Tutorial", "Other"], required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VaultItem", vaultItemSchema);
