// backend/Routes/rolesPermissionRoutes.js
const express = require("express");
const router = express.Router();
const RolesPermission = require("../models/rolesPermissionModel");

// Create a role
router.post("/", async (req, res) => {
  try {
    const newRole = new RolesPermission(req.body);
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get roles by gymId
router.get("/", async (req, res) => {
  try {
    const roles = await RolesPermission.find({ gymId: req.query.gymId });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update role
router.put("/:id", async (req, res) => {
  try {
    const updated = await RolesPermission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete role
router.delete("/:id", async (req, res) => {
  try {
    await RolesPermission.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
