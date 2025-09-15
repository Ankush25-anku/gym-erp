const express = require("express");
const mongoose = require("mongoose"); // ✅ Added for ObjectId casting
const router = express.Router();

const Member = require("../models/Member");
const AdminTrainer = require("../models/admintrainer");
const AdminStaff = require("../models/adminstaffattendance");
const AdminAttendance = require("../models/Attendance");
const Expense = require("../models/Expense");

// ✅ Get all members (with optional gymId)
router.get("/members", async (req, res) => {
  try {
    const { gymId } = req.query;
    const filter = {};

    if (gymId && gymId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gymId" });
      }
      filter.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const members = await Member.find(filter).populate("gymId", "name");
    res.json(members);
  } catch (err) {
    console.error("❌ SuperAdmin Member fetch failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all trainers (with optional gymId)
router.get("/trainers", async (req, res) => {
  try {
    const { gymId } = req.query;
    const filter = {};

    if (gymId && gymId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gymId" });
      }
      filter.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const trainers = await AdminTrainer.find(filter);
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all staff (with optional gymId)
router.get("/staff", async (req, res) => {
  try {
    const { gymId } = req.query;
    const filter = {};

    if (gymId && gymId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gymId" });
      }
      filter.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const staff = await AdminStaff.find(filter);
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get total expenses (with optional gymId)
router.get("/expenses/total", async (req, res) => {
  try {
    const { gymId } = req.query;
    const match = {};

    if (gymId && gymId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gymId" });
      }
      match.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const total = await Expense.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ total: total[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get attendance (with optional date and gymId)
router.get("/attendance", async (req, res) => {
  try {
    const { date, gymId } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (gymId && gymId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gymId" });
      }
      filter.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const attendance = await AdminAttendance.find(filter);
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
