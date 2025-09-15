const mongoose = require("mongoose");

const AdminTrainerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    experience: String,
    rating: Number,
    specialties: [String],
    
    // ✅ Updated: Array of references to TrainerMember
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainerMember",
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    joined: String,

    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
  },
  { timestamps: true }
);

const AdminTrainer = mongoose.models.AdminTrainer || mongoose.model("AdminTrainer", AdminTrainerSchema);

module.exports = AdminTrainer;
