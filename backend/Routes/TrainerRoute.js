const express = require("express");
const router = express.Router();
const TrainerMember = require("../models/TrainerMemberModel");

// GET all members
router.get("/members", async (req, res) => {
  try {
    const members = await TrainerMember.find();
    res.json(members);
  } catch (err) {
    console.error("Error fetching trainer members:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update member info or workouts
router.put("/members/:id", async (req, res) => {
  try {
    const updatedMember = await TrainerMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(updatedMember);
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/members/:memberId/workouts/:workoutIndex", async (req, res) => {
  const { memberId, workoutIndex } = req.params;

  try {
    const member = await TrainerMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const index = parseInt(workoutIndex);
    if (isNaN(index) || index < 0 || index >= member.assignedWorkouts.length) {
      return res.status(400).json({ message: "Invalid workout index" });
    }

    // Remove the workout from assignedWorkouts
    member.assignedWorkouts.splice(index, 1);
    await member.save();

    res.status(200).json({ message: "Workout deleted successfully", member });
  } catch (err) {
    console.error("❌ Error deleting workout:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
