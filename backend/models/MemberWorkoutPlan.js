// const mongoose = require("mongoose");

// const WorkoutSchema = new mongoose.Schema({
//   day: {
//     type: String,
//     enum: [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ],
//     required: true,
//   },
//   workout: { type: String, required: true },
//   weight: String,
//   sets: String,
//   reps: String,
//   rest: String,
//   description: String,
//   images: [String], // Array of image filenames or URLs
// });

// const MemberWorkoutPlanSchema = new mongoose.Schema(
//   {
//     memberId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Member",
//       required: true,
//       unique: true, // One workout plan per member
//     },
//     assignedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Assuming trainers are in the User model
//     },
//     workouts: [WorkoutSchema],
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// module.exports = mongoose.model("MemberWorkoutPlan", MemberWorkoutPlanSchema);



const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  day: String,
  workout: String,
  weight: Number,
  sets: Number,
  reps: Number,
  rest: Number,
  description: String,
  images: [String],
});

const MemberWorkoutPlanSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
    unique: true,
  },
  assignedBy: {
    type: String,
    default: "Trainer",
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  workouts: [WorkoutSchema],
});

module.exports = mongoose.model("MemberWorkoutPlan", MemberWorkoutPlanSchema);
