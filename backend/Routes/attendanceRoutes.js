const express = require("express");
const router = express.Router();
const CheckIn = require("../models/CheckIn");

// GET /api/attendance?date=YYYY-MM-DD&search=...
router.get("/", async (req, res) => {
  const { date, search = "" } = req.query;

  try {
    const records = await CheckIn.find({
      date,
      memberName: { $regex: search, $options: "i" },
    });

    const checkInsToday = records.length;
    const currentlyInside = records.filter((r) => !r.checkOutTime).length;
    const avgStayTime =
      records.reduce((total, r) => {
        if (r.checkOutTime) {
          const minutes = (new Date(r.checkOutTime) - new Date(r.checkInTime)) / (1000 * 60);
          return total + minutes;
        }
        return total;
      }, 0) / (records.filter((r) => r.checkOutTime).length || 1);

    const peakHour = "6:00–7:00 PM"; // Optional: Replace with logic later

    res.json({
      checkInsToday,
      currentlyInside,
      avgStayTime: `${Math.round(avgStayTime)} min`,
      peakHour,
      records,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
