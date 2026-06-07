import mongoose, { Document } from 'mongoose';

export interface IOTPVerification extends Document {
  phone?: string;
  email?: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  type: 'phone' | 'email';
}

const otpSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  type: { type: String, enum: ['phone', 'email'], required: true }
}, { timestamps: true });

// TTL index - auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ phone: 1, type: 1 });

export default mongoose.model<IOTPVerification>('OTPVerification', otpSchema);
