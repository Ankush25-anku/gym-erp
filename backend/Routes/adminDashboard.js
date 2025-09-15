// backend/Routes/adminDashboard.js
const express = require("express");
const router = express.Router();
// your custom auth
const verifyClerkToken = require("../middleware/verifyClerkToken"); // Clerk auth

const Member = require("../models/Member");
const Trainer = require("../models/admintrainer");
const Staff = require("../models/Staff");
const Expense = require("../models/Expense");
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

// Middleware to support both auth methods
const authMiddleware = async (req, res, next) => {
  try {
    // Try Clerk token first
    await verifyClerkToken(req, res, async () => {
      next();
    });
  } catch (err) {
    // If Clerk fails, try custom token
    verifyToken(req, res, next);
  }
};

// GET /api/admin/stats?gymId=<gymId>
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const { gymId } = req.query;
    if (!gymId) return res.status(400).json({ error: "Missing gymId" });

    const objectGymId = new mongoose.Types.ObjectId(gymId); // ✅ convert string to ObjectId

    // Count documents
    const membersCount = await Member.countDocuments({ gymId: objectGymId });
    const trainersCount = await Trainer.countDocuments({ gymId: objectGymId });
    const staffCount = await Staff.countDocuments({ gymId: objectGymId });

    // Total expenses
    const expensesTotal = await Expense.aggregate([
      { $match: { gymId: objectGymId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Check-ins
    const memberCheckins = await Attendance.countDocuments({
      gymId: objectGymId,
      category: "Member",
      status: "Check-in",
    });

    const staffTrainerCheckins = await Attendance.countDocuments({
      gymId: objectGymId,
      category: { $in: ["Staff", "Trainer"] },
      status: "Check-in",
    });

    res.json({
      members: membersCount,
      trainers: trainersCount,
      staff: staffCount,
      expenses: expensesTotal[0]?.total || 0,
      memberCheckins,
      staffTrainerAttendance: staffTrainerCheckins,
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
