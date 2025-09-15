const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  day: String,
  workout: String,
  weight: Number,
  sets: Number,
  reps: Number,
  rest: Number,
  description: String,
  images: [String] // ✅ Store both images (0.jpg, 1.jpg)
});

const TrainerMemberSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    plan: String,
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    },
    expires: String,
    joined: String,
    initials: String,

    // ✅ Embed full workout info
    assignedWorkouts: [WorkoutSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainerMember", TrainerMemberSchema);
