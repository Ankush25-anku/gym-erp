// routes/memberPayments.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/memberPayment");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// -----------------------------
// Get all payments for logged-in user
// -----------------------------
router.get("/", verifyClerkToken, async (req, res) => {
  try {
    const ownerEmail = req.clerkUser.email;
    const payments = await Payment.find({ userEmail: ownerEmail }).sort({
      date: -1,
    });
    res.json(payments);
  } catch (err) {
    console.error("❌ GET /member-payments failed:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// -----------------------------
// Create a new payment
// -----------------------------
router.post("/", verifyClerkToken, async (req, res) => {
  try {
    const ownerEmail = req.clerkUser.email;

    const newPayment = new Payment({
      ...req.body,
      userEmail: ownerEmail,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    console.error("❌ POST /member-payments failed:", err); // 👈 full error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors, // 👈 show which field failed
      });
    }
    res
      .status(500)
      .json({ error: "Failed to save payment", details: err.message });
  }
});

module.exports = router;
