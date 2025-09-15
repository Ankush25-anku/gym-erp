// const express = require("express");
// const router = express.Router();
// const Gym = require("../models/Gym");
// const authMiddleware = require("../middleware/auth");
// const User = require("../models/User");

// // ✅ Create new gym (using logged-in user's email)
// router.post("/create", authMiddleware, async (req, res) => {
//   const { name, phone, address, subscriptionPlan, status } = req.body;

//   if (!name || !phone || !address || !subscriptionPlan || !status) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     console.log("🔐 Logged-in user:", req.user); // ✅ DEBUG

//     // Step 1: Create new gym document
//     const newGym = new Gym({
//       name,
//       email: req.user.email, // tied to logged-in user's email
//       phone,
//       address,
//       subscriptionPlan,
//       status,
//     });

//     const savedGym = await newGym.save();

//     // Step 2: Assign this gym ID to the logged-in user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { gymId: savedGym._id },
//       { new: true }
//     );

//     console.log("✅ User updated with gymId:", updatedUser);

//     res.status(201).json(savedGym);
//   } catch (err) {
//     console.error("Error creating gym:", err);
//     res.status(500).json({ error: "Failed to create gym" });
//   }
// });

// // ✅ Get gyms: Superadmin sees all, others see only their gyms
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     let gyms;
//     if (req.user.role === "superadmin") {
//       gyms = await Gym.find(); // 🔁 Return all gyms for superadmin
//     } else {
//       gyms = await Gym.find({ email: req.user.email }); // 👤 Only user's gyms
//     }
//     res.status(200).json(gyms);
//   } catch (err) {
//     console.error("Error fetching gyms:", err);
//     res.status(500).json({ error: "Failed to fetch gyms" });
//   }
// });

// // ✅ Update gym by ID
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updatedGym);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update gym" });
//   }
// });

// // ✅ Delete gym by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     await Gym.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Gym deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete gym" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Gym = require("../models/Gym");
const User = require("../models/User");
const verifyClerkToken = require("../middleware/verifyClerkToken");

// ❌ Removed authMiddleware from this route
// ✅ Create new gym (public route)
// ✅ Fixed /my route
router.get("/my", verifyClerkToken, async (req, res) => {
  try {
    const ownerEmail = req.clerkUser?.email;
    if (!ownerEmail) {
      return res.status(400).json({ error: "Owner email not found in token" });
    }

    console.log("Fetching gyms for:", ownerEmail); // 🟢 Debug log

    // Removed isDeleted filter (not in schema)
    const gyms = await Gym.find({ email: ownerEmail });
    res.json(gyms);
  } catch (err) {
    console.error("Error fetching gyms:", err);
    res.status(500).json({ error: "Failed to fetch gyms" });
  }
});

// Create gym with Clerk auth
router.post("/create", verifyClerkToken, async (req, res) => {
  const { name, phone, address, subscriptionPlan, status } = req.body;
  const email = req.clerkUser.email; // 👈 FIXED

  if (!name || !phone || !address || !subscriptionPlan || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newGym = new Gym({
      name,
      email,
      phone,
      address,
      subscriptionPlan,
      status,
    });
    const savedGym = await newGym.save();
    res.status(201).json(savedGym);
  } catch (err) {
    console.error("Error creating gym:", err);
    res.status(500).json({ error: "Failed to create gym" });
  }
});

// ❌ Removed authMiddleware
// ✅ Get all gyms (public)
router.get("/", async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.status(200).json(gyms);
  } catch (err) {
    console.error("Error fetching gyms:", err);
    res.status(500).json({ error: "Failed to fetch gyms" });
  }
});

// ✅ Update gym by ID (public)
router.put("/:id", async (req, res) => {
  try {
    const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedGym);
  } catch (err) {
    res.status(500).json({ error: "Failed to update gym" });
  }
});

// ✅ Delete gym by ID (public)
router.delete("/:id", async (req, res) => {
  try {
    await Gym.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gym deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete gym" });
  }
});

module.exports = router;
