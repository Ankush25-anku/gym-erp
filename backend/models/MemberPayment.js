const mongoose = require("mongoose");

const memberPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true }, // Razorpay payment ID
    orderId: { type: String, required: true }, // Razorpay order ID
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    memberName: { type: String, required: true }, // store member's name for quick lookup
    amount: { type: Number, required: true }, // in INR (not paise)
    method: { type: String, required: true }, // Razorpay, Cash, etc.
    date: { type: Date, default: Date.now },
    userEmail: { type: String, required: true }, // ✅ logged-in user who recorded the payment
  },
  { timestamps: true }
);

module.exports = mongoose.model("MemberPayment", memberPaymentSchema);
