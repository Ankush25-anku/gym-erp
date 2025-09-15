const mongoose = require("mongoose");

const superAdminUserSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "trainer", "staff", "member"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // automatically creates createdAt and updatedAt
  }
);

// Export under a distinct model name
module.exports =
  mongoose.models.SuperAdminUser ||
  mongoose.model("SuperAdminUser", superAdminUserSchema);
