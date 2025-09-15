// routes/currentUserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// ✅ Get currently logged-in user (from Clerk)
router.get("/", verifyClerkToken, async (req, res) => {
  try {
    const { sub: clerkId, email } = req.clerkUser; // ✅ now pulling from req.clerkUser

    // Look up user by clerkId first, then fallback to email
    let user = await User.findOne({ clerkId });
    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching current user:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;
