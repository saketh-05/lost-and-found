import { Schema, model } from "mongoose";

const lostItemSchema = new Schema({
  email: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    coordinates: { type: [Number], required: true },
  },
  featureVector: { type: [Number], required: false }, // Optional
});

export default LostItem = model("LostItem", lostItemSchema);
