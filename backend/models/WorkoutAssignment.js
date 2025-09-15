const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  day: String,
  workout: String,
  weight: Number,
  sets: Number,
  reps: Number,
  rest: Number,
  description: String,
});

const WorkoutAssignmentSchema = new mongoose.Schema({
  assignedBy: String,
  assignTo: {
    type: String,
    enum: ["member", "class"],
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrainerMember",
    default: null,
  },
  className: {
    type: String,
    default: null,
  },
  fromDate: String,
  repeatDays: Number,
  workouts: [WorkoutSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model("WorkoutAssignment", WorkoutAssignmentSchema);
