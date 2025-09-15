const express = require("express");
const router = express.Router();
const MemberAttendance = require("../models/MemberAttendance");
const jwt = require("jsonwebtoken");

// Optional: Token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ GET attendance for specific member
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const records = await MemberAttendance.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("Error fetching member attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
