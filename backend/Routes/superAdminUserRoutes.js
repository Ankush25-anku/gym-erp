const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const SuperAdminUser = require("../models/SuperAdminUser");

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary upload helper
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "user-profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ Create user
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, password, role, status, gymId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required." });
    }

    const existingUser = await SuperAdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let profileImage = "";
    if (req.file) {
      profileImage = await uploadToCloudinary(req.file.buffer);
    }

    const newUser = new SuperAdminUser({
      name,
      email,
      phone,
      passwordHash,
      role,
      status,
      profileImage,
      gymId: mongoose.Types.ObjectId.isValid(gymId) ? gymId : null,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
});

// ✅ Update user
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, password, role, status, gymId } = req.body;
    const updateFields = { name, email, phone, role, status };

    if (mongoose.Types.ObjectId.isValid(gymId)) {
      updateFields.gymId = gymId;
    }

    if (password) {
      updateFields.passwordHash = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateFields.profileImage = imageUrl;
    }

    const updatedUser = await SuperAdminUser.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await SuperAdminUser.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// ✅ Delete user
router.delete("/:id", async (req, res) => {
  try {
    await SuperAdminUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
