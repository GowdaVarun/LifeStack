const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
