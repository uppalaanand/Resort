
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'receptionist' | 'manager';
  phone?: string;
  authProvider: 'local' | 'google';
  googleId?: string;
  firebaseUid?: string;
  profilePhoto?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  // PMS Enhancement Fields
  address?: string;
  idProofType?: 'Aadhar' | 'PAN' | 'Passport' | 'DrivingLicense' | 'VoterID';
  idProofNumber?: string;
  phoneVerified: boolean;
  totalVisits: number;
  totalSpend: number;
  lastStay?: Date;
  notes?: string;
  isActive: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional if using Google Auth
  role: { type: String, enum: ['user', 'admin', 'receptionist', 'manager'], default: 'user' },
  phone: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  firebaseUid: { type: String },
  profilePhoto: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // PMS Enhancement Fields
  address: { type: String },
  idProofType: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'DrivingLicense', 'VoterID'] },
  idProofNumber: { type: String },
  phoneVerified: { type: Boolean, default: false },
  totalVisits: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 },
  lastStay: { type: Date },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for PMS queries
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Pre-save hook to hash password
UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return ;
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash as string, salt);
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
