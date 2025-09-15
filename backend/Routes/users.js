


// routes/users.js
// routes/users.js
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const authMiddleware = require("../middleware/auth");

// // ✅ Get all users (with gym info populated)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const users = await User.find().populate("gymId"); // populate gym info
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// // ✅ Update a user (supports gymId, profileImage, etc.)
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { name, email, role, status, profileImage, gymId } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { name, email, role, status, profileImage, gymId },
//       { new: true }
//     ).populate("gymId"); // return updated gym info

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update user" });
//   }
// });

// // ✅ Delete a user
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) return res.status(404).json({ error: "User not found" });
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// });

// module.exports = router;














const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Get all users (with gym info populated)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("gymId"); // populate gym info
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Update a user (supports gymId, profileImage, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role, status, profileImage, gymId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status, profileImage, gymId },
      { new: true }
    ).populate("gymId"); // return updated gym info

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
