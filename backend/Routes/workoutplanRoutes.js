const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/TrainerMemberModel");

// GET all workout plans
router.get("/members", async (req, res) => {
  try {
    const members = await WorkoutPlan.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// UPDATE full member including workouts
router.put("/members/:id", async (req, res) => {
  const memberId = req.params.id;
  const updateData = req.body;

  try {
    const updated = await WorkoutPlan.findByIdAndUpdate(memberId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

module.exports = router;
