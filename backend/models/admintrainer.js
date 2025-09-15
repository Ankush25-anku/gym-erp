const mongoose = require("mongoose");

const adminTrainerSchema = new mongoose.Schema({
  name: String,
  email: String,
  experience: String,
  rating: Number,
  specialties: [String],
  members: Number,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  joined: Date,
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gym",
  },

  // ✅ User-based isolation
  userEmail: {
    type: String,
    required: true, // Ensures each trainer is linked to a specific logged-in user
  },

  // ✅ (Optional but recommended) Add createdBy reference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports =
  mongoose.models.AdminTrainer ||
  mongoose.model("AdminTrainer", adminTrainerSchema);
