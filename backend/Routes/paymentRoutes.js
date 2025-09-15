const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// ✅ CREATE payment
// ✅ CREATE payment
router.post("/", verifyClerkToken, async (req, res) => {
  try {
    const { gymId, amount, method, transactionId, status } = req.body;

    if (!gymId || !amount || !method || !transactionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPayment = new Payment({
      gymId,
      userId: req.clerkUser.sub,
      amount,
      method,
      transactionId,
      status: status || "Pending",
    });

    const saved = await newPayment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to create payment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all payments by gymId
router.get("/", verifyClerkToken, async (req, res) => {
  const { gymId } = req.query;
  if (!gymId) return res.status(400).json({ error: "gymId is required" });

  try {
    const payments = await Payment.find({ gymId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch payments:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE payment
router.put("/:id", verifyClerkToken, async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Failed to update payment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE payment
router.delete("/:id", verifyClerkToken, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payment deleted" });
  } catch (err) {
    console.error("❌ Failed to delete payment:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
