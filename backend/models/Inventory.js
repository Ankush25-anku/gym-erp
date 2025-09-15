const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Gym",
    },
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Out of Stock", "In Use"], // ✅ enum validation
    },
    notes: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false, // ✅ support soft delete
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", InventorySchema);
