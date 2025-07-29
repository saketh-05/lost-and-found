import { Schema, model } from "mongoose";

const FoundItemSchema = new Schema({
  email: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  reportedDate: { type: Date, default: Date.now },
  return_done: { type: Boolean, default: false },
  featureVector: { type: Array, default: [] }, // OpenCV feature vector
});
FoundItemSchema.index({ location: "2dsphere" });
export default model("FoundItem", FoundItemSchema);
