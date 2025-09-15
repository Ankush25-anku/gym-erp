const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// ✅ GET all attendance records filtered by date and gymId (and optional category)
router.get("/", async (req, res) => {
  try {
    const { date, category, gymId } = req.query;

    const filter = {};

    // ✅ Allow gymId to be optional (for "All Gyms" case)
    if (gymId) filter.gymId = gymId;
    if (date) filter.date = date;
    if (category) filter.category = category;

    const records = await Attendance.find(filter).sort({ time: -1 });
    res.json(records);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// ✅ POST new attendance record
router.post("/", async (req, res) => {
  const { userId, status, date, category, gymId } = req.body;

  if (!userId || !status || !date || !category || !gymId) {
    return res.status(400).json({
      error: "userId, status, date, category, and gymId are required",
    });
  }

  try {
    const newAttendance = new Attendance({
      userId, // ✅ use the destructured userId
      status,
      date,
      category,
      gymId,
      time: new Date(), // timestamp
    });

    const saved = await newAttendance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

// ✅ PUT update existing attendance record by ID
router.put("/:id", async (req, res) => {
  const { userId, status, date, category, gymId } = req.body;

  if (!userId || !status || !date || !category || !gymId) {
    return res.status(400).json({
      error: "userId, status, date, category, and gymId are required",
    });
  }

  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        status,
        date,
        category,
        gymId,
        time: new Date(), // update timestamp
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

// ✅ DELETE attendance record
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

// ✅ GET all attendance records for a specific user and gym
router.get("/userAttendance", async (req, res) => {
  try {
    const { userId, gymId } = req.query;

    if (!userId || !gymId) {
      return res.status(400).json({ error: "userId and gymId are required" });
    }

    const records = await Attendance.find({ userId, gymId }).sort({ time: -1 });
    res.json(records);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch user attendance" });
  }
});

module.exports = router;
