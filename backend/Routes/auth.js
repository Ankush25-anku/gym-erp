// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/auth");

// // ✅ GET /api/auth/me — Return current user info from JWT
// router.get("/me", authMiddleware, (req, res) => {
//   res.json({
//     _id: req.user._id,
//     gymId: req.user.gymId,
//     email: req.user.email,
//     role: req.user.role,
//   });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

// ⚠️ WARNING: This skips authentication entirely

// ✅ GET /api/auth/me — Return placeholder user info (auth removed)
router.get("/me", (req, res) => {
  // Example static response (replace as needed)
  res.json({
    _id: "dummy-user-id",
    gymId: "dummy-gym-id",
    email: "user@example.com",
    role: "admin", // or "superadmin", "member", etc.
  });
});

module.exports = router;
