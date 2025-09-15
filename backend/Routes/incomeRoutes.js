// routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const Income = require("../models/incomeModel");

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming payload:", req.body); // ✅ debug incoming data

    const { gymId, clerkId, source, amount, date, paymentMethod } = req.body;

    if (!gymId || !clerkId || !source || !amount || !date || !paymentMethod) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newIncome = new Income(req.body);
    const saved = await newIncome.save();

    console.log("✅ Income saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving income:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ (by gymId)
router.get("/", async (req, res) => {
  try {
    const { gymId } = req.query;
    console.log("🔎 Fetching incomes for gymId:", gymId);

    if (!gymId) return res.status(400).json({ error: "gymId is required" });

    const incomes = await Income.find({ gymId }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error("❌ Error fetching incomes:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating income:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (err) {
    console.error("❌ Error deleting income:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
