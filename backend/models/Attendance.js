const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "category", // dynamic reference
    },
    category: {
      type: String,
      enum: ["Member", "Trainer", "Staff"],
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
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Correct export
module.exports = mongoose.model("Attendance", AttendanceSchema);
