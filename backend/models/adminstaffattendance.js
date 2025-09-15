const mongoose = require("mongoose");

const adminStaffAttendanceSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true, // improves query performance for filtering by email
    },

    name: String,
    email: String,
    phone: String,
    status: {
      type: String,
      enum: ["Present", "Absent"], // ✅ Capitalized to match your POST request
      required: true,
    },

    date: String,
    time: String,
    remarks: String,
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "AdminStaffAttendance",
  adminStaffAttendanceSchema
);
