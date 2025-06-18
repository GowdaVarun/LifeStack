const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");
const goalRoutes = require("./routes/goals");
const financeRoutes = require("./routes/finance");
const vaultRoutes = require("./routes/vault");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/vault", vaultRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log(" Server running on http://localhost:5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
