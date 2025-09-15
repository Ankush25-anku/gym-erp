const mongoose = require("mongoose");

const MemberAttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    status: {
      type: String,
      enum: ["Check-in", "Check-out"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Safe registration to avoid OverwriteModelError
module.exports =
  mongoose.models.MemberAttendance ||
  mongoose.model("MemberAttendance", MemberAttendanceSchema);
