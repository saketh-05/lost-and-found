const mongoose = require("mongoose");

const UserContactSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserContact", UserContactSchema);
