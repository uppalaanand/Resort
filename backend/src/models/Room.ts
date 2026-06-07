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
  // PMS Enhancement Fields
  roomNumber?: string;
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Cleaning';
  floor?: number;
  currentBooking?: mongoose.Types.ObjectId;
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
  maxBeds: { type: Number, required: true },
  // PMS Enhancement Fields
  roomNumber: { type: String, unique: true, sparse: true },
  status: { 
    type: String, 
    enum: ['Available', 'Reserved', 'Occupied', 'Maintenance', 'Cleaning'], 
    default: 'Available' 
  },
  floor: { type: Number },
  currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
}, {
  timestamps: true
});

// Indexes for PMS queries
RoomSchema.index({ status: 1, isActive: 1 });
RoomSchema.index({ roomNumber: 1 });

export default mongoose.model<IRoom>('Room', RoomSchema);
