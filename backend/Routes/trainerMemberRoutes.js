const express = require("express");
const router = express.Router();
const TrainerMember = require("../models/trainermember");

// ✅ GET all members
router.get("/", async (req, res) => {
  try {
    const members = await TrainerMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

// ✅ POST a new member
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, plan, status, expires, joined, initials } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    const newMember = new TrainerMember({
      name,
      email,
      phone,
      plan,
      status,
      expires,
      joined,
      initials,
    });

    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save member" });
  }
});

// ✅ Assign workouts to a member
router.post("/assign-workout/:id", async (req, res) => {
  try {
    const { workouts } = req.body;
    const memberId = req.params.id;

    const member = await TrainerMember.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.assignedWorkouts.push(...workouts); // directly embed workouts
    await member.save();

    res.status(200).json({ message: "Workout assigned successfully", member });
  } catch (err) {
    console.error("Workout assign error:", err);
    res.status(500).json({ message: "Failed to assign workout" });
  }
});

// ✅ GET assigned workouts for a specific member (used by memberWorkoutPlanPage)
router.get("/assigned-workouts/:memberId", async (req, res) => {
  try {
    const member = await TrainerMember.findById(req.params.memberId);

    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json([
      {
        fromDate: new Date().toISOString(), // or store and return if you have a field
        workouts: member.assignedWorkouts || [],
      },
    ]);
  } catch (err) {
    console.error("❌ Error fetching assigned workouts:", err);
    res.status(500).json({ message: "Failed to fetch workouts" });
  }
});

module.exports = router;
