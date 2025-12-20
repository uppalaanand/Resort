import mongoose from "mongoose";

export interface IGallery extends mongoose.Document {
  images: string[];
  category: "surroundings" | "rooms" | "dining" | "events";
  alt: string;
}

const gallerySchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ["surroundings", "rooms", "dining", "events"],
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>("Gallery", gallerySchema);