const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

const webhookRoutes = require("./Routes/webhookRoutes");
app.use("/api/webhook", webhookRoutes);
console.log("✅ /api/webhook route mounted");

app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes

const adminDashboardRoutes = require("./Routes/adminDashboard");
app.use("/api/admin", adminDashboardRoutes);
console.log("✅ Admin dashboard routes loaded");
const memberRoutes = require("./Routes/memberRoutes");
app.use("/api/members", memberRoutes);

const eventRoutes = require("./Routes/eventRoutes");
app.use("/api/events", eventRoutes);

const planRoutes = require("./Routes/planRoutes");
app.use("/api/plans", planRoutes);

// const authRoutes = require("./Routes/authRoutes");
// app.use("/api/auth", authRoutes);

const attendanceRoutes = require("./Routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

// const trainerRoutes = require("./Routes/trainerRoutes");
// app.use("/api/trainers", trainerRoutes);
const adminTrainerRoutes = require("./Routes/admintrainerRoutes");
app.use("/api/admintrainers", adminTrainerRoutes);

// const myMembersRoutes = require("./Routes/myMembersRoutes");
// app.use("/api/members", myMembersRoutes);
const adminAttendanceRoutes = require("./Routes/attendenceAdminRoutes");
app.use("/api/admin/attendance", adminAttendanceRoutes);
const inventoryRoutes = require("./Routes/inventoryRoutes");
app.use("/api/inventory", inventoryRoutes);

const trainerMemberRoutes = require("./Routes/trainerMemberRoutes");
const trainerWorkoutRoutes = require("./Routes/trainerWorkoutRoutes");
//member route
app.use("/api/trainer/members", trainerMemberRoutes);

app.use("/api/trainer/workouts", trainerWorkoutRoutes);

const trainerAttendanceRoutes = require("./Routes/trainerAttendanceRoutes");

app.use("/api/trainer/attendance", trainerAttendanceRoutes);

const staffmembersRoutes = require("./Routes/staffmembersRoutes");
app.use("/api/staffmembers", staffmembersRoutes);

const staffplansRoutes = require("./Routes/staffplansRoutes");
app.use("/api/staffplans", staffplansRoutes);

const staffattendanceRoutes = require("./Routes/staffattendanceRoutes");
app.use("/api/staffattendance", staffattendanceRoutes);

// app.use('/exercise', express.static(path.join(__dirname, 'public', 'exercise')));
const workoutplanRoutes = require("./Routes/workoutplanRoutes");
app.use("/api/workoutplan", workoutplanRoutes);

const trainerRoutes = require("./Routes/TrainerRoute");
app.use("/api/trainer", trainerRoutes);

const adminStaffRoutes = require("./Routes/adminstaffRoutes");
app.use("/api/adminstaff", adminStaffRoutes);

const currentUserRoutes = require("./Routes/currentUserRoutes");

// 👇 this matches what your frontend expects
app.use("/api/current-user", currentUserRoutes);

const expensesRoutes = require("./Routes/expensesRoutes");
app.use("/api/expenses", expensesRoutes);

// const userRoutes = require("./Routes/users");
// app.use("/api/users", userRoutes);

const memberWorkoutPlanRoutes = require("./Routes/memberWorkoutPlanRoutes");
app.use("/api/member/workout-plans", memberWorkoutPlanRoutes);

const memberAttendanceRoutes = require("./Routes/memberAttendanceRoutes");
app.use("/api/member-attendance", memberAttendanceRoutes);

const userRoutes = require("./Routes/users");
app.use("/api/users", userRoutes);

const clerkWebhookRoutes = require("./Routes/clerkWebhookRoutes");
app.use("/api/clerk", clerkWebhookRoutes);

const attend = require("./Routes/attend");
app.use("/api", attend);

const incomeRoutes = require("./Routes/incomeRoutes");
app.use("/api/income", incomeRoutes);
const gymRoutes = require("./Routes/gymRoutes");
app.use("/api/gyms", gymRoutes); // ✅ this is critical

const userManagementRoutes = require("./Routes/userRoutes");
app.use("/api/user-management", userManagementRoutes);
const authRoutes = require("./Routes/auth"); // ✅ Fix the casing
app.use("/api/auth", authRoutes);

const notificationRoutes = require("./Routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const paymentRoutes = require("./Routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// Load the routes
const rolesPermissionRoutes = require("./Routes/rolesPermissionRoutes");
app.use("/api/roles-permissions", rolesPermissionRoutes);

const superAdminUserRoutes = require("./Routes/superAdminUserRoutes");
app.use("/api/superadmin/users", superAdminUserRoutes);

// const userRoutes = require("./Routes/users");
// app.use("/api/users", userRoutes);
const razorpayRoutes = require("./Routes/razorpayRoutes");
app.use("/api/razorpay", razorpayRoutes);

const superadminRoutes = require("./Routes/superadminRoutes");
app.use("/api/superadmin", superadminRoutes);

const clerkUserRoutes = require("./Routes/clerkUserRoutes");
app.use("/api/clerkusers", clerkUserRoutes);

console.log("✅ Clerk user routes loaded");

const memberPaymentsRoutes = require("./Routes/memberPayments");

app.use("/api/member-payments", memberPaymentsRoutes);

// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Working API" });
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Let me know if you want the frontend payment button integration (with Razorpay popup or Stripe checkout) as well.
