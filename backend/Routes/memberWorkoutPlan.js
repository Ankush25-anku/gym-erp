// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Member = require("../models/Member");
// const MemberWorkoutPlan = require("../models/MemberWorkoutPlan");

// router.get("/workoutplan", auth, async (req, res) => {
//   console.log("✅ /api/member/workoutplan hit");

//   // ✅ ADD THIS LINE to see what's in req.user
//   console.log("🔐 Authenticated user:", req.user);

//   try {
//     const userId = req.user.id || req.user._id; // Use correct key

//     const member = await Member.findOne({ userId });
//     if (!member) {
//       console.log("❌ Member not found for userId:", userId);
//       return res.status(404).json({ message: "Member not found" });
//     }

//     const workoutPlan = await MemberWorkoutPlan.findOne({ memberId: member._id });
//     if (!workoutPlan) {
//       console.log("❌ Workout plan not found for memberId:", member._id);
//       return res.status(404).json({ message: "Workout plan not found" });
//     }

//     res.json({
//       member: {
//         name: member.name,
//         email: member.email,
//         plan: member.plan,
//         expires: member.expires,
//       },
//       workouts: workoutPlan.workouts,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching workout plan:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// module.exports = router;
