const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
    clerkId: { type: String, required: true }, // ✅ store Clerk userId
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    referenceId: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Income || mongoose.model("Income", incomeSchema);
