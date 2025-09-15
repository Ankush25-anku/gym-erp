// models/AdminAttendance.js
const mongoose = require("mongoose");

const AdminAttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // added
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Member", "Trainer", "Staff"],
    default: "Member",
  },
  status: {
    type: String,
    enum: ["Check-in", "Check-out"],
    required: true,
  },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminAttendance", AdminAttendanceSchema);
