const express = require("express");
const router = express.Router();
const StaffMember = require("../models/StaffMembers");

// GET all staff members (sorted by join date descending)
router.get("/", async (req, res) => {
  try {
    const members = await StaffMember.find().sort({ joined: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff members" });
  }
});

// POST a new staff member
router.post("/", async (req, res) => {
  try {
    const newMember = new StaffMember(req.body);
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to add staff member", details: err.message });
  }
});

// PUT update an existing staff member by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await StaffMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Staff member not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update staff member", details: err.message });
  }
});

// DELETE a staff member by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await StaffMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Staff member not found" });
    res.json({ message: "Staff member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete staff member", details: err.message });
  }
});

module.exports = router;
