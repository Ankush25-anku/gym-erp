const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");4
// const Member = require("../models/Member");

router.get("/userAttendance", async (req, res) => {
  try {
    const { userId } = req.query;
    const records = await Attendance.find({ userId })
      .sort({ time: -1 })
      .populate("userId", "fullname"); // 👈 this pulls `fullname` from User

    res.json(records);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
