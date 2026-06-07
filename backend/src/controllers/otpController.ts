import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import OTPVerification from '../models/OTPVerification';
import User from '../models/User';
import { emailService } from '../services/emailService';
import { logActivity, ACTIONS } from '../utils/activityLogger';

interface AuthRequest extends Request {
  user?: any;
}

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// @desc    Send OTP via email
// @route   POST /api/otp/send
// @access  Private
export const sendOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Rate limit: max 3 OTPs per email in 10 minutes
  const recentOTPs = await OTPVerification.countDocuments({
    email,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  });

  if (recentOTPs >= 3) {
    res.status(429);
    throw new Error('Too many OTP requests. Please wait 10 minutes.');
  }

  const otp = generateOTP();
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);

  await OTPVerification.create({
    email,
    otp: hashedOTP,
    type: 'email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send OTP via email
  await emailService.sendOTPEmail(email, otp);

  await logActivity({
    action: ACTIONS.OTP_SENT,
    entityType: 'otp',
    entityId: req.user?._id || email,
    performedBy: req.user?._id,
    details: { email, type: 'email' },
    req,
  });

  res.json({ message: 'OTP sent successfully', expiresIn: '10 minutes' });
});

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Private
export const verifyOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Email and OTP are required');
  }

  // Find the most recent non-verified OTP for this email
  const otpRecord = await OTPVerification.findOne({
    email,
    type: 'email',
    verified: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    res.status(400);
    throw new Error('OTP expired or not found. Please request a new one.');
  }

  // Check attempts
  if (otpRecord.attempts >= 5) {
    res.status(429);
    throw new Error('Too many failed attempts. Please request a new OTP.');
  }

  // Verify OTP
  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  otpRecord.verified = true;
  await otpRecord.save();

  // Mark user phone as verified if applicable
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { phoneVerified: true });
  }

  await logActivity({
    action: ACTIONS.OTP_VERIFIED,
    entityType: 'otp',
    entityId: req.user?._id || email,
    performedBy: req.user?._id,
    details: { email },
    req,
  });

  res.json({ message: 'OTP verified successfully', verified: true });
});
