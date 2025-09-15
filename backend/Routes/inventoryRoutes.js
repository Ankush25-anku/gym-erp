const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const mongoose = require("mongoose");

// GET all items for a gym (filter by isDeleted)
router.get("/", async (req, res) => {
  try {
    const { gymId, isDeleted } = req.query;
    if (!gymId) return res.status(400).json({ error: "Missing gymId" });

    const filter = { gymId: gymId };
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === "true";

    const items = await Inventory.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Failed to fetch inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// POST add new item
router.post("/", async (req, res) => {
  try {
    let { gymId, itemName, quantity, status, notes, isDeleted } = req.body;

    if (!gymId || !itemName || quantity === undefined || !status) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(400).json({ error: "Invalid gymId" });
    }

    const newItem = new Inventory({
      gymId,
      itemName,
      quantity,
      status,
      notes,
      isDeleted: isDeleted || false,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving inventory:", err);
    res.status(500).json({ error: "Failed to save inventory item" });
  }
});

// PUT update item (also handles soft delete)
router.put("/:id", async (req, res) => {
  try {
    const { gymId, itemName, quantity, status, notes, isDeleted } = req.body;

    const updateData = {};
    if (gymId) updateData.gymId = gymId;
    if (itemName !== undefined) updateData.itemName = itemName;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;

    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ error: "Item not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update inventory:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE permanently remove item (only if you want hard delete)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item permanently deleted" });
  } catch (err) {
    console.error("❌ Failed to delete inventory:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
