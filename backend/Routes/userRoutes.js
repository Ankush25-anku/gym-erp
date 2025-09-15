// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const router = express.Router();
// const Gym = require("../models/Gym");
// const User = require("../models/User");
// const authMiddleware = require("../middleware/auth");

// // ✅ REGISTER a new user
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Name, email, and password are required" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       passwordHash,
//       role: "member", // Change this if needed
//       status: "active",
//     });

//     const savedUser = await newUser.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         _id: savedUser._id,
//         email: savedUser.email,
//         role: savedUser.role,
//         gymId: savedUser.gymId || null,
//       },
//     });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // ✅ LOGIN user and return JWT
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ error: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

//     // ✅ If admin and gymId is null, auto-link their gym
//     if (user.role === "admin" && !user.gymId) {
//       const gym = await Gym.findOne({ email: user.email });
//       if (gym) {
//         user = await User.findByIdAndUpdate(
//           user._id,
//           { gymId: gym._id },
//           { new: true }
//         );
//       }
//     }

//     const token = jwt.sign(
//       {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//          gymId: user.gymId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//         gymId: user.gymId || null,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // ✅ CREATE new gym and assign it to the logged-in user
// router.post("/create", authMiddleware, async (req, res) => {
//   const { name, phone, address, subscriptionPlan, status } = req.body;

//   if (!name || !phone || !address || !subscriptionPlan || !status) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const newGym = new Gym({
//       name,
//       email: req.user.email,
//       phone,
//       address,
//       subscriptionPlan,
//       status,
//     });

//     const savedGym = await newGym.save();

//     await User.findByIdAndUpdate(
//       req.user._id,
//       { gymId: savedGym._id },
//       { new: true }
//     );

//     res.status(201).json(savedGym);
//   } catch (err) {
//     console.error("Error creating gym:", err);
//     res.status(500).json({ error: "Failed to create gym" });
//   }
// });

// // ✅ GET gyms created by current user
// router.get("/gyms", authMiddleware, async (req, res) => {
//   try {
//     const gyms = await Gym.find({ email: req.user.email });
//     res.status(200).json({ gyms });
//   } catch (err) {
//     console.error("Error fetching gyms:", err);
//     res.status(500).json({ error: "Failed to fetch gyms" });
//   }
// });

// // ✅ UPDATE a gym by ID
// router.put("/gyms/:id", async (req, res) => {
//   try {
//     const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updatedGym);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update gym" });
//   }
// });

// // ✅ DELETE a gym by ID
// router.delete("/gyms/:id", async (req, res) => {
//   try {
//     await Gym.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Gym deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete gym" });
//   }
// });

// // ✅ GET all users (for Super Admin Users Page)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const users = await User.find(); // You can filter by role if needed
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const router = express.Router();
// const Gym = require("../models/Gym");
// const User = require("../models/User");

// // ✅ REGISTER a new user
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Name, email, and password are required" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       passwordHash,
//       role: "member",
//       status: "active",
//     });

//     const savedUser = await newUser.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         _id: savedUser._id,
//         email: savedUser.email,
//         role: savedUser.role,
//         gymId: savedUser.gymId || null,
//       },
//     });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // ✅ LOGIN user and return JWT
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ error: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

//     // Auto-link gym if not already assigned
//     if (user.role === "admin" && !user.gymId) {
//       const gym = await Gym.findOne({ email: user.email });
//       if (gym) {
//         user = await User.findByIdAndUpdate(
//           user._id,
//           { gymId: gym._id },
//           { new: true }
//         );
//       }
//     }

//     const token = jwt.sign(
//       {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//         gymId: user.gymId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//         gymId: user.gymId || null,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // ✅ CREATE gym (now requires gym owner email and userId in body)
// router.post("/create", async (req, res) => {
//   const { name, phone, address, subscriptionPlan, status, email, userId } = req.body;

//   if (!name || !phone || !address || !subscriptionPlan || !status || !email || !userId) {
//     return res.status(400).json({ error: "All fields including email and userId are required" });
//   }

//   try {
//     const newGym = new Gym({
//       name,
//       email,
//       phone,
//       address,
//       subscriptionPlan,
//       status,
//     });

//     const savedGym = await newGym.save();

//     await User.findByIdAndUpdate(userId, { gymId: savedGym._id });

//     res.status(201).json(savedGym);
//   } catch (err) {
//     console.error("Error creating gym:", err);
//     res.status(500).json({ error: "Failed to create gym" });
//   }
// });

// // ✅ GET all gyms (optionally filtered by email query param)
// router.get("/gyms", async (req, res) => {
//   try {
//     const { email } = req.query;

//     const filter = email ? { email } : {};
//     const gyms = await Gym.find(filter);

//     res.status(200).json({ gyms });
//   } catch (err) {
//     console.error("Error fetching gyms:", err);
//     res.status(500).json({ error: "Failed to fetch gyms" });
//   }
// });

// // ✅ UPDATE gym by ID (public)
// router.put("/gyms/:id", async (req, res) => {
//   try {
//     const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updatedGym);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update gym" });
//   }
// });

// // ✅ DELETE gym by ID (public)
// router.delete("/gyms/:id", async (req, res) => {
//   try {
//     await Gym.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Gym deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete gym" });
//   }
// });

// // ✅ GET all users (public access)
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// module.exports = router;

// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Gym = require("../models/Gym");
const User = require("../models/User");

/* ---------------------- User Routes ---------------------- */

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/by-clerk/:clerkId
router.get("/by-clerk/:clerkId", async (req, res) => {
  const user = await User.findOne({ clerkId: req.params.clerkId });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

// GET /api/users/me (clerkId from header)
router.get("/me", async (req, res) => {
  const clerkId = req.header("x-clerk-user-id");
  if (!clerkId)
    return res.status(400).json({ error: "x-clerk-user-id missing" });

  const user = await User.findOne({ clerkId });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

/* ---------------------- Auth Routes ---------------------- */

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: "member",
      status: "active",
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        gymId: savedUser.gymId || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    if (user.role === "admin" && !user.gymId) {
      const gym = await Gym.findOne({ email: user.email });
      if (gym) {
        user = await User.findByIdAndUpdate(
          user._id,
          { gymId: gym._id },
          { new: true }
        );
      }
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role, gymId: user.gymId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        gymId: user.gymId || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ---------------------- Gym Routes ---------------------- */

// CREATE gym
router.post("/create", async (req, res) => {
  const { name, phone, address, subscriptionPlan, status, email, userId } =
    req.body;
  if (
    !name ||
    !phone ||
    !address ||
    !subscriptionPlan ||
    !status ||
    !email ||
    !userId
  )
    return res
      .status(400)
      .json({ error: "All fields including email and userId are required" });

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
    await User.findByIdAndUpdate(userId, { gymId: savedGym._id });
    res.status(201).json(savedGym);
  } catch (err) {
    res.status(500).json({ error: "Failed to create gym" });
  }
});

// GET gyms
router.get("/gyms", async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email } : {};
    const gyms = await Gym.find(filter);
    res.json({ gyms });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gyms" });
  }
});

// UPDATE gym
router.put("/gyms/:id", async (req, res) => {
  try {
    const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedGym);
  } catch (err) {
    res.status(500).json({ error: "Failed to update gym" });
  }
});

// DELETE gym
router.delete("/gyms/:id", async (req, res) => {
  try {
    await Gym.findByIdAndDelete(req.params.id);
    res.json({ message: "Gym deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete gym" });
  }
});

module.exports = router;
