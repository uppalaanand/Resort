import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  targetType: 'room' | 'banquet';
  room?: mongoose.Types.ObjectId;
  banquetHall?: mongoose.Types.ObjectId;
  ratingStars: number;
  ratingOutOf10?: number;
  comment?: string;
  photos?: string[];
  verifiedStay: boolean;
}

const ReviewSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['room', 'banquet'], required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  banquetHall: { type: mongoose.Schema.Types.ObjectId, ref: 'BanquetHall' },
  ratingStars: { type: Number, required: true, min: 1, max: 5 },
  ratingOutOf10: { type: Number, min: 1, max: 10 },
  comment: { type: String },
  photos: [{ type: String }],
  verifiedStay: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IReview>('Review', ReviewSchema);
