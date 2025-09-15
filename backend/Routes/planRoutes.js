const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Get all plans for a specific user
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ error: "userEmail query is required" });
    }

    const plans = await Plan.find({ userEmail });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Create a new plan (requires userEmail)
router.post("/", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "userEmail is required" });
    }

    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update a plan
router.put("/:id", async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete a plan
router.delete("/:id", async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stripe: Create Payment Intent
router.post("/pay/stripe", async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const amount = plan.type === "year" ? plan.yearlyPrice * 100 : plan.monthlyPrice * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: { planId },
    });

    res.json({ clientSecret: paymentIntent.client_secret, planId: plan._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stripe: Confirm success and update members
router.post("/payment/success", async (req, res) => {
  try {
    const { planId } = req.body;

    const updated = await Plan.findByIdAndUpdate(
      planId,
      { $inc: { members: 1 } },
      { new: true }
    );

    res.json({ message: "Payment recorded", plan: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { planId } = req.body;
  const plan = await Plan.findById(planId);

  if (!plan) return res.status(404).json({ error: "Plan not found" });

  const price = plan.type === "year" ? plan.yearlyPrice : plan.monthlyPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: plan.name },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ sessionId: session.id });
});

module.exports = router;
