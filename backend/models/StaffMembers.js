const mongoose = require("mongoose");

const StaffMemberSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: String,
  plan: String,
  expires: Date,
  joined: Date,
  trainer: Boolean,
});

module.exports = mongoose.model("StaffMember", StaffMemberSchema);
