// routes/memberWorkoutplanroutes.js
const express = require("express");
const router = express.Router();
const TrainerMember = require("../models/trainermember");

// Correct route in backend
// ✅ Route: GET /api/member/workout-plans/all
// ✅ GET all members and their assigned workouts
router.get("/all", async (req, res) => {
  try {
    const members = await TrainerMember.find(); // fetches all members
    res.json(members);
  } catch (err) {
    console.error("❌ Failed to fetch all members:", err);
    res.status(500).json({ message: "Failed to fetch all members" });
  }
});



router.post("/", async (req, res) => {
  try {
    const { memberId, workouts } = req.body;
    if (!memberId || !workouts || workouts.length === 0) {
      return res.status(400).json({ message: "Missing memberId or workouts" });
    }

    const member = await TrainerMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.assignedWorkouts.push(...workouts);
    await member.save();

    res.status(200).json({ message: "Workout plan added", member });
  } catch (err) {
    console.error("Failed to save workout plan:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
