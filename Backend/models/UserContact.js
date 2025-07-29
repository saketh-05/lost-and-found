import { Schema, model } from "mongoose";

const UserContactSchema = new Schema({
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model("UserContact", UserContactSchema);
