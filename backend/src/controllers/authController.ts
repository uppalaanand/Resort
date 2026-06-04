import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import asyncHandler from 'express-async-handler';
import { verifyFirebaseToken } from '../utils/firebaseAdmin';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if(userExists) {
        (res as any).status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        passwordHash: password,
        phone,
        role: req.body.role || 'user'
    });

    if(user) {
        (res as any).status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else{
        (res as any).status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
    (res as any).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    (res as any).status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Authenticate with Firebase Google ID token
// @route   POST /api/auth/google-login
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    res.status(400);
    throw new Error('Firebase ID token is required');
  }

  let decodedToken;
  try {
    decodedToken = await verifyFirebaseToken(idToken);
  } catch (error: any) {
    res.status(401);
    throw new Error('Invalid Firebase token: ' + error.message);
  }

  const { uid, email, name, picture } = decodedToken;
  if (!email) {
    res.status(400);
    throw new Error('Email is not verified or not provided by Google');
  }

  // Look for user by email or firebaseUid
  let user = await User.findOne({ $or: [{ email }, { firebaseUid: uid }] });

  if (user) {
    // If user has a phone number, log them in directly
    if (user.phone) {
      // Update fields if they weren't set (e.g. user was previously local auth)
      let needsSave = false;
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        needsSave = true;
      }
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        needsSave = true;
      }
      if (picture && !user.profilePhoto) {
        user.profilePhoto = picture;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id),
      });
      return;
    } else {
      // User exists but has no phone number (incomplete profile)
      // Send a temporary registration token
      const tempToken = jwt.sign(
        { temp: true, firebaseUid: uid, email, name: user.name, picture: user.profilePhoto || picture },
        env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({
        requiresProfileCompletion: true,
        tempToken,
        user: {
          name: user.name,
          email,
          firebaseUid: uid,
          profilePhoto: user.profilePhoto || picture
        }
      });
      return;
    }
  }

  // User does not exist, send a temporary token for profile completion
  const tempToken = jwt.sign(
    { temp: true, firebaseUid: uid, email, name, picture },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.json({
    requiresProfileCompletion: true,
    tempToken,
    user: {
      name,
      email,
      firebaseUid: uid,
      profilePhoto: picture
    }
  });
});

// @desc    Complete profile (phone number collection) and generate normal session JWT
// @route   POST /api/auth/google-complete-profile
// @access  Public
export const googleCompleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, phone } = req.body;
  if (!tempToken || !phone) {
    res.status(400);
    throw new Error('Temporary registration token and phone number are required');
  }

  // Validate phone number format (basic check)
  const cleanPhone = phone.trim();
  if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^[+]?[0-9\s\-()]+$/.test(cleanPhone)) {
    res.status(400);
    throw new Error('Invalid phone number format');
  }

  let decoded: any;
  try {
    decoded = jwt.verify(tempToken, env.JWT_SECRET);
  } catch (error: any) {
    res.status(401);
    throw new Error('Registration session expired or invalid. Please sign in with Google again.');
  }

  if (!decoded.temp || !decoded.firebaseUid || !decoded.email) {
    res.status(401);
    throw new Error('Invalid registration token');
  }

  const { firebaseUid, email, name, picture } = decoded;

  // Double check if user already exists
  let user = await User.findOne({ $or: [{ email }, { firebaseUid }] });

  if (user) {
    // If they exist now, update phone number
    user.phone = cleanPhone;
    user.firebaseUid = firebaseUid;
    user.authProvider = 'google';
    if (picture) user.profilePhoto = picture;
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      phone: cleanPhone,
      firebaseUid,
      authProvider: 'google',
      profilePhoto: picture,
      role: 'user'
    });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profilePhoto: user.profilePhoto,
    token: generateToken(user._id),
  });
});