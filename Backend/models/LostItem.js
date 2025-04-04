const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Image file path
  city: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  reportedDate: { type: Date, default: Date.now },
  return_done: { type: Boolean, default: false },
  featureVector: { type: Array, default: [] } // OpenCV feature vector
});

module.exports = mongoose.model("LostItem", LostItemSchema);
