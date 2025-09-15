const express = require("express");
const router = express.Router();
const WorkoutAssignment = require("../models/WorkoutAssignment");
const TrainerMember = require("../models/trainermember");

// POST: Assign workout
router.post("/", async (req, res) => {
  try {
    const {
      assignedBy,
      assignTo,
      memberId,
      className,
      fromDate,
      repeatDays,
      workouts,
    } = req.body;

    const newAssignment = new WorkoutAssignment({
      assignedBy,
      assignTo,
      memberId: assignTo === "member" ? memberId : null,
      className: assignTo === "class" ? className : null,
      fromDate,
      repeatDays,
      workouts,
    });

    const saved = await newAssignment.save();

    if (assignTo === "member" && memberId) {
      await TrainerMember.findByIdAndUpdate(memberId, {
        $push: { assignedWorkouts: saved._id },
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error assigning workout:", err);
    res.status(500).json({ message: "Failed to assign workout" });
  }
});

// PUT: Update workout
router.put("/:id", async (req, res) => {
  try {
    const updated = await WorkoutAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Failed to update workout assignment:", err);
    res.status(500).json({ message: "Failed to update workout assignment" });
  }
});

// ✅ NEW: GET assigned workouts for a specific member
router.get("/assigned-workouts/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const workouts = await WorkoutAssignment.find({
      assignTo: "member",
      memberId,
    }).sort({ fromDate: -1 });

    res.json(workouts);
  } catch (err) {
    console.error("Failed to fetch assigned workouts:", err);
    res.status(500).json({ message: "Failed to fetch assigned workouts" });
  }
});

module.exports = router;
