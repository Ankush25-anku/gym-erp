const mongoose = require("mongoose");

const ClerkUserSchema = new mongoose.Schema({
  sub: {
    type: String,
    required: true,
    unique: true, // Clerk user ID (from token)
  },
  email: {
    type: String,
    default: "",
  },
  first_name: {
    type: String,
    default: "",
  },
  last_name: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "trainer", "member", "superadmin"],
    default: "member",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClerkUser", ClerkUserSchema);
