const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Gym = require("../models/Gym");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

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
    return res.status(400).json({ error: "Email and password required" });

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // auto-link gym if admin
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

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// CREATE GYM
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
  ) {
    return res
      .status(400)
      .json({ error: "All fields including email and userId are required" });
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

    await User.findByIdAndUpdate(userId, { gymId: savedGym._id });

    res.status(201).json(savedGym);
  } catch (err) {
    res.status(500).json({ error: "Failed to create gym" });
  }
});

module.exports = router;
