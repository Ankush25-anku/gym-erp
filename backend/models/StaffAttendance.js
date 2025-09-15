const mongoose = require("mongoose");

const staffAttendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Check-in", "Check-out"],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("StaffAttendance", staffAttendanceSchema);
