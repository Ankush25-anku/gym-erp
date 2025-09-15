const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// ✅ CREATE notification
router.post("/", verifyClerkToken, async (req, res) => {
  try {
    const { gymId, userId, type, title, message } = req.body;

    if (!gymId || !type || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Attach current Clerk user if not provided
    const creatorId = userId || req.clerkUser.sub;

    const newNotification = new Notification({
      gymId,
      userId: creatorId,
      type,
      title,
      message,
    });

    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// ✅ READ notifications by gymId
router.get("/", verifyClerkToken, async (req, res) => {
  const { gymId } = req.query;
  if (!gymId) return res.status(400).json({ error: "gymId is required" });

  try {
    const notifications = await Notification.find({ gymId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ UPDATE notification
router.put("/:id", verifyClerkToken, async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Failed to update notification:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// ✅ DELETE notification
router.delete("/:id", verifyClerkToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error("❌ Failed to delete notification:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

module.exports = router;
