
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  phone?: string;
  authProvider: 'local' | 'google';
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional if using Google Auth
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash as string, salt);
  next();
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
