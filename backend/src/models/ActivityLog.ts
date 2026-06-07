import mongoose, { Document } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  performedBy?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  timestamp: Date;
}

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },     // BOOKING_CREATED, BOOKING_APPROVED, GUEST_CHECKIN, etc.
  entityType: { type: String, required: true },  // booking, room, user, payment
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

activityLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
activityLogSchema.index({ performedBy: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
