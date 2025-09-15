const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
    userId: { type: String, required: true }, // <-- change to String
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
