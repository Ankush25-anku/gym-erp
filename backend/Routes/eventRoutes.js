const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ GET events by date: /api/events?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const events = await Event.find({ date });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ POST to create a new event
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: "Failed to create event", details: err });
  }
});

module.exports = router;
