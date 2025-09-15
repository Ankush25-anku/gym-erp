// // routes/adminAttendanceRoutes.js
// const express = require("express");
// const router = express.Router();
// const AdminAttendance = require("../models/TrainerAttendance");
// const auth = require("../middleware/auth");

// // ✅ GET /api/admin/attendance?date=YYYY-MM-DD
// router.get("/", auth, async (req, res) => {
//   try {
//     const { category } = req.query;

//     const filter = {};
//     if (category) {
//       filter.category = category;

//       // If it's a trainer, show only his/her records
//       if (category === "Trainer") {
//         filter.userId = req.user._id;
//       }
//     }

//     const records = await Attendance.find(filter).sort({ date: -1 });
//     res.json(records);
//   } catch (err) {
//     console.error("GET /attendance error:", err);
//     res.status(500).json({ error: "Failed to fetch attendance" });
//   }
// });

// // ✅ POST /api/admin/attendance
// router.post("/", auth, async (req, res) => {
//   try {
//     const { status, date, category } = req.body;

//     if (!status || !date || !category) {
//       return res.status(400).json({ error: "Status, date, and category are required" });
//     }

//     const newAttendance = new Attendance({
//       userId: req.user._id,   // pulled from token
//       name: req.user.name,    // pulled from token
//       status,
//       date,
//       category,
//     });

//     const saved = await newAttendance.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("POST /attendance error:", err);
//     res.status(500).json({ error: "Failed to mark attendance" });
//   }
// });


// // ✅ PUT /api/admin/attendance/:id
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const { status, date, category = "Member" } = req.body;

//     if (!status || !date) {
//       return res.status(400).json({ error: "Status and date are required" });
//     }

//     const updated = await AdminAttendance.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.id }, // ✅ only allow updating own data
//       {
//         status,
//         date,
//         category,
//         time: new Date(),
//       },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ error: "Attendance not found or unauthorized" });

//     res.json(updated);
//   } catch (err) {
//     console.error("PUT error:", err);
//     res.status(500).json({ error: "Failed to update attendance" });
//   }
// });

// // ✅ DELETE /api/admin/attendance/:id
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const deleted = await AdminAttendance.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!deleted) return res.status(404).json({ error: "Attendance not found or unauthorized" });

//     res.json({ message: "Attendance deleted successfully" });
//   } catch (err) {
//     console.error("DELETE error:", err);
//     res.status(500).json({ error: "Failed to delete attendance" });
//   }
// });

// module.exports = router;


// routes/adminAttendanceRoutes.js
const express = require("express");
const router = express.Router();
const AdminAttendance = require("../models/TrainerAttendance");

// ✅ GET /api/admin/attendance?category=Trainer
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const records = await AdminAttendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("GET /attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// ✅ POST /api/admin/attendance
router.post("/", async (req, res) => {
  try {
    const { status, date, category, userId, name } = req.body;

    if (!status || !date || !category || !userId || !name) {
      return res.status(400).json({ error: "Status, date, category, name, and userId are required" });
    }

    const newAttendance = new AdminAttendance({
      userId,
      name,
      status,
      date,
      category,
    });

    const saved = await newAttendance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /attendance error:", err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// ✅ PUT /api/admin/attendance/:id
router.put("/:id", async (req, res) => {
  try {
    const { status, date, category = "Member" } = req.body;

    if (!status || !date) {
      return res.status(400).json({ error: "Status and date are required" });
    }

    const updated = await AdminAttendance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        date,
        category,
        time: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Attendance not found" });

    res.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

// ✅ DELETE /api/admin/attendance/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AdminAttendance.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Attendance not found" });

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

module.exports = router;
