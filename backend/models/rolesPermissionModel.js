// backend/Models/RolesPermissionModel.js
const mongoose = require("mongoose");

const RolesPermissionSchema = new mongoose.Schema(
  {
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
    roleName: { type: String, required: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RolesPermission", RolesPermissionSchema);
