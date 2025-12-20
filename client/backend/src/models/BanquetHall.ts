import mongoose, { Document, Schema } from 'mongoose';

export interface IBanquetHall extends Document {
  name: string;
  description: string;
  capacity: number;
  pricePerPlate: number;
  amenities: string[];
  images: string[];
  supportedEvents: string[];
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
}

const BanquetHallSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true },
  pricePerPlate: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  supportedEvents: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IBanquetHall>('BanquetHall', BanquetHallSchema);
