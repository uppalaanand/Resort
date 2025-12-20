import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  description: string;
  pricePerNight: number;
  discountPrice: number;
  maxGuests: number;
  bedType: string;
  roomSize: string;
  amenities: string[];
  images: string[];
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  maxBeds: number;
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  discountPrice: { type: Number},
  maxGuests: { type: Number, required: true },
  bedType: { type: String },
  roomSize: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  maxBeds: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IRoom>('Room', RoomSchema);
