const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "Not Started" }, // or "In Progress", "Completed"
  milestones: [{ type: String }],
  reviewNotes: [{ date: Date, note: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
