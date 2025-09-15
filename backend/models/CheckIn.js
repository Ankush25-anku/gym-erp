const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  memberName: String,
  checkInTime: Date,
  checkOutTime: Date,
  date: String, // Format: YYYY-MM-DD
});

module.exports = mongoose.model("CheckIn", checkInSchema);
