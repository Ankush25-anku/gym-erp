const mongoose = require("mongoose");

const memberUserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("MemberUser", memberUserSchema);
