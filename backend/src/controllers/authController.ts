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
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id),
      });
      return;
    }

    // Secure fallback: If MongoDB bcrypt match fails, check if we can verify credentials with Firebase Auth.
    // This allows local email/password users who reset their password in Firebase to log in and sync local hash automatically.
    if (user && user.authProvider === 'local') {
      const apiKey = process.env.VITE_FIREBASE_API_KEY || 'mock-api-key';
      
      // Support mock local login for development environment
      if (apiKey === 'mock-api-key' && process.env.NODE_ENV !== 'production' && password.startsWith('mock-pass-')) {
        user.passwordHash = password;
        await user.save();
        (res as any).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profilePhoto: user.profilePhoto,
          token: generateToken(user._id),
        });
        return;
      }

      try {
        console.log("Attempting Firebase Auth verification for:", email, "with key:", apiKey);
        const fbResponse = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true
            })
          }
        );
        if (fbResponse.ok) {
          console.log("Firebase Auth verification succeeded for:", email);
          user.passwordHash = password;
          await user.save();
          
          (res as any).json({
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
          const errData = await fbResponse.json().catch(() => ({}));
          console.log("Firebase Auth verification failed for:", email, "Status:", fbResponse.status, "Error:", errData);
        }
      } catch (err) {
        console.error("Firebase Auth login synchronization check failed:", err);
      }
    }

    (res as any).status(401);
    throw new Error('Invalid email or password');
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

// @desc    Initiate Firebase Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });

  // Generic success response to avoid email enumeration
  if (!user) {
    res.json({
      success: true,
      triggerClientReset: false,
      message: 'If an account exists for this email, a password reset link has been sent.'
    });
    return;
  }

  if (user.authProvider === 'google') {
    res.json({
      success: false,
      isGoogleUser: true,
      message: 'This account uses Google Sign-In. Please continue with Google to access your account.'
    });
    return;
  }

  const admin = await import('../utils/firebaseAdmin');
  try {
    try {
      await admin.default.auth().getUserByEmail(email);
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/user-not-found') {
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        await admin.default.auth().createUser({
          email,
          displayName: user.name,
          password: randomPassword
        });
      } else {
        throw fbErr;
      }
    }

    res.json({
      success: true,
      triggerClientReset: true,
      message: 'If an account exists for this email, a password reset link has been sent.'
    });
  } catch (err: any) {
    res.status(500);
    throw new Error('Failed to verify or register account for reset: ' + err.message);
  }
});