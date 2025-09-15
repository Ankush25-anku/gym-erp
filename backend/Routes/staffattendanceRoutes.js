const express = require("express");
const router = express.Router();
const StaffAttendance = require("../models/StaffAttendance");

// @route   GET /api/staffattendance
// @desc    Get attendance records by date and search
router.get("/", async (req, res) => {
  try {
    const { date, search } = req.query;
    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // ✅ match frontend field
    }

    const records = await StaffAttendance.find(filter).sort({ createdAt: -1 });

    res.json(records); // ✅ frontend expects just array, not analytics object
  } catch (err) {
    console.error("GET /api/staffattendance error:", err);
    res.status(500).json({ error: "Failed to fetch staff attendance" });
  }
});

// @route   POST /api/staffattendance
// @desc    Mark a new staff attendance
router.post("/", async (req, res) => {
  try {
    const { name, status, date } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ error: "name, status, and date are required" });
    }

    const attendance = new StaffAttendance({
      name, // ✅ match frontend field
      status,
      date,
      time: new Date(), // save a general timestamp
    });

    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/staffattendance error:", err);
    res.status(500).json({ error: "Failed to create staff attendance" });
  }
});

// @route   PUT /api/staffattendance/:id
// @desc    Update staff attendance by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, status, date } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ error: "name, status, and date are required" });
    }

    const updated = await StaffAttendance.findByIdAndUpdate(
      req.params.id,
      {
        name,
        status,
        date,
        time: new Date(), // update timestamp
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/staffattendance/:id error:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

// @route   DELETE /api/staffattendance/:id
// @desc    Delete staff attendance by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await StaffAttendance.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json({ success: true, message: "Attendance record deleted" });
  } catch (err) {
    console.error("DELETE /api/staffattendance/:id error:", err);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

module.exports = router;
