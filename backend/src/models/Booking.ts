import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId;
  type: 'room' | 'banquet';
  room?: mongoose.Types.ObjectId;
  banquetHall?: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  numberOfGuests: number;
  eventType?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Rejected';
  specialRequests?: string;
  totalPrice?: number;
  extraBeds: number;
  checkInTime?: string;
  checkOutTime?: string; 
  requested?: Boolean;
  // PMS Enhancement Fields
  source: 'ONLINE' | 'OFFLINE';
  rejectionReason?: string;
  approvedBy?: mongoose.Types.ObjectId;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  checkedInBy?: mongoose.Types.ObjectId;
  checkedOutBy?: mongoose.Types.ObjectId;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Failed' | 'Partial';
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'BankTransfer' | 'Online';
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  guestAddress?: string;
  idProofType?: string;
  idProofNumber?: string;
  occupancy?: number;
  notes?: string;
}

const BookingSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for offline walk-ins
  type: { type: String, enum: ['room', 'banquet'], required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  banquetHall: { type: mongoose.Schema.Types.ObjectId, ref: 'BanquetHall' },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  eventType: { type: String }, // For banquets
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Rejected'], 
    default: 'Pending' 
  },
  specialRequests: { type: String },
  totalPrice: { type: Number },
  extraBeds: { type: Number },
  checkInTime: { type: String, default: '12:00'},
  checkOutTime: { type: String, default: '10:00'},
  requested: { type: Boolean },
  // PMS Enhancement Fields
  source: { type: String, enum: ['ONLINE', 'OFFLINE'], default: 'ONLINE' },
  rejectionReason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedInAt: { type: Date },
  checkedOutAt: { type: Date },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Refunded', 'Failed', 'Partial'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'BankTransfer', 'Online'] },
  guestName: { type: String },
  guestPhone: { type: String },
  guestEmail: { type: String },
  guestAddress: { type: String },
  idProofType: { type: String },
  idProofNumber: { type: String },
  occupancy: { type: Number },
  notes: { type: String }
}, {
  timestamps: true
});

// Indexes for PMS queries
BookingSchema.index({ room: 1, fromDate: 1, toDate: 1, status: 1 }); // Availability checks & double-booking prevention
BookingSchema.index({ user: 1, createdAt: -1 }); // User booking history
BookingSchema.index({ status: 1, createdAt: -1 }); // Dashboard queries
BookingSchema.index({ source: 1, status: 1 }); // Source-based filtering

export default mongoose.model<IBooking>('Booking', BookingSchema);
