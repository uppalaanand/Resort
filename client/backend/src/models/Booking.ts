import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  type: 'room' | 'banquet';
  room?: mongoose.Types.ObjectId;
  banquetHall?: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  numberOfGuests: number;
  eventType?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  specialRequests?: string;
  totalPrice?: number;
}

const BookingSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['room', 'banquet'], required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  banquetHall: { type: mongoose.Schema.Types.ObjectId, ref: 'BanquetHall' },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  eventType: { type: String }, // For banquets
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  specialRequests: { type: String },
  totalPrice: { type: Number }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
