const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number, required: true },
  type: { type: String, enum: ["month", "year"], required: true },
  duration: { type: String, required: true },
  features: { type: [String], default: [] },
  members: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  popular: { type: Boolean, default: false },

  // ✅ New field to store user identity
  userEmail: { type: String, required: true },
}, {
  timestamps: true, // optional: for createdAt / updatedAt tracking
});

module.exports = mongoose.model("Plan", planSchema);
