const mongoose = require("mongoose");

const FoundItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  city: { type: String, required: true },
  reportedDate: { type: Date, default: Date.now },
  return_done: { type: Boolean, default: false },
  featureVector: { type: Array, default: [] } // OpenCV feature vector
});

module.exports = mongoose.model("FoundItem", FoundItemSchema);
