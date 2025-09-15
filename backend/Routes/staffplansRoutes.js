const express = require("express");
const router = express.Router();
const StaffPlan = require("../models/StaffPlan");

// GET all staff plans
router.get("/", async (req, res) => {
  try {
    const plans = await StaffPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

// POST create a new plan
router.post("/", async (req, res) => {
  try {
    const newPlan = new StaffPlan(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ error: "Failed to create plan", details: err.message });
  }
});

// PUT update a plan
router.put("/:id", async (req, res) => {
  try {
    const updatedPlan = await StaffPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: "Failed to update plan", details: err.message });
  }
});

// DELETE a plan
router.delete("/:id", async (req, res) => {
  try {
    await StaffPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete plan", details: err.message });
  }
});

module.exports = router;
