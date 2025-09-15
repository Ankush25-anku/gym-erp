const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidTo: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    description: {
      type: String,
    },
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
