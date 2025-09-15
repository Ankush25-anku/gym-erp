
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["superadmin", "admin", "trainer", "member", "staff"], // ✅ Added superadmin
//       default: "member",
//     },

//     gymId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Gym",
//       default: null,
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.models.User || mongoose.model("User", userSchema);


// models/usermodel

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     clerkId: {
//       type: String,
//       unique: true,
//       sparse: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       index: true,
//     },
//     firstName: String,
//     lastName: String,
//     fullName: String,
//     imageUrl: String,

//     // Whatever else you already store in your ERP:
//     role: {
//       type: String,
//       enum: ["superadmin", "admin", "trainer", "member", "staff", "user"],
//       default: "user",
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive", "blocked"],
//       default: "active",
//     },
//     phone: String,

//     metadata: mongoose.Schema.Types.Mixed,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["superadmin", "admin", "trainer", "member", "staff"], // ✅ Added superadmin
//       default: "member",
//     },

//     gymId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Gym",
//       default: null,
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.models.User || mongoose.model("User", userSchema);



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    firstName: String,
    lastName: String,
    fullName: String,
    imageUrl: String,
    phone: String,

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["superadmin", "admin", "trainer", "member", "staff", "user"],
      default: "user",
    },

    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
