// routes/clerkUserRoutes.js
const express = require("express");
const router = express.Router();
const ClerkUser = require("../models/ClerkUser");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// 🔁 Sync Clerk user to MongoDB
router.post("/sync", verifyClerkToken, async (req, res) => {
  try {
    const { sub, email, first_name, last_name, role } = req.clerkUser;
    const fullName = `${first_name} ${last_name}`.trim();

    const updatedUser = await ClerkUser.findOneAndUpdate(
      { sub },
      {
        sub,
        email,
        first_name,
        last_name,
        fullName,
        role,
      },
      { upsert: true, new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("🔴 Sync Error:", err);
    res.status(500).json({ error: "Failed to sync Clerk user" });
  }
});

// 🙋‍♂️ Get logged-in Clerk user info
router.get("/me", verifyClerkToken, async (req, res) => {
  try {
    const { sub } = req.clerkUser;

    const user = await ClerkUser.findOne({ sub });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      sub: user.sub,
    });
  } catch (err) {
    console.error("🔴 /me route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
