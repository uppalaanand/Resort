import mongoose, { Document, Schema } from "mongoose";

export interface IRoomRequest extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  numberOfGuests: number;
  extraBeds: number;
  contactName?: string;
  contactPhone?: string;
  specialRequests?: string;
  checkInTime?: string;
  checkOutTime?: string; 
  status: "Pending" | "Approved" | "Rejected";
}

const RoomRequestSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true},
    fromDate: { type: Date, required: true},
    toDate: { type: Date, required: true},
    numberOfGuests: { type: Number, required: true},
    extraBeds: { type: Number, default: 0},
    contactName: { type: String},
    contactPhone: { type: String},
    specialRequests: { type: String},
    checkInTime: { type: String, default: '12:00'},
    checkOutTime: { type: String, default: '10:00'},
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoomRequest>("RoomRequest", RoomRequestSchema);