const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["class", "pt"], required: true },
  date: { type: String, required: true }, // format: "YYYY-MM-DD"
  time: String,
});

module.exports = mongoose.model("Event", eventSchema);
