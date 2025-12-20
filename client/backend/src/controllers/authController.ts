
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import crypto from 'crypto';
// In a real app, import nodemailer config here

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = (req as any).body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    (res as any).status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    phone,
    role: 'user'
  });

  if (user) {
    (res as any).status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    (res as any).status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = (req as any).body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    (res as any).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    (res as any).status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Google Login Stub
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, googleId, photo } = (req as any).body; 
  // NOTE: In production, verify the Google ID token using google-auth-library

  let user = await User.findOne({ email });

  if (!user) {
    // Create new user from Google data
    user = await User.create({
      name,
      email,
      authProvider: 'google',
      googleId,
      passwordHash: '' // No password for google users
    });
  } else if (!user.googleId) {
    // Link google ID to existing email if not already linked
    user.googleId = googleId;
    user.authProvider = 'google'; // or both
    await user.save();
  }

  (res as any).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});
