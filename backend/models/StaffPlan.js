const mongoose = require("mongoose");

const StaffPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billing: { type: String, enum: ["month", "year"], required: true },
  duration: { type: String, required: true },
  tag: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  members: { type: Number, default: 0 },
  features: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model("StaffPlan", StaffPlanSchema);
