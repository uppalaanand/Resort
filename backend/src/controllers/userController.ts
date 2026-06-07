import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import { logActivity, ACTIONS } from '../utils/activityLogger';

interface AuthRequest extends Request {
  user?: any;
  body: any;
  headers: any;
}

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, search } = req.query;
  const filter: any = {};
  
  if (role) filter.role = role;
  if (search) {
    const regex = new RegExp(search as string, 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  const users = await User.find(filter)
    .select('-passwordHash')
    .sort({ createdAt: -1 });
  (res as any).json(users);
});

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  if (user) {
    (res as any).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      phoneVerified: user.phoneVerified,
      totalVisits: user.totalVisits,
      totalSpend: user.totalSpend,
      lastStay: user.lastStay,
    });
  } else {
    (res as any).status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PATCH /api/users/my
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  console.log("Updating user profile for:", req.user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    
    // FIX: Password update now requires current password verification
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        (res as any).status(400);
        throw new Error('Incorrect current password');
      }
      user.passwordHash = req.body.newPassword;
    }
    // REMOVED: Direct password set without verification (security fix)

    const updatedUser = await user.save();

    (res as any).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profilePhoto: updatedUser.profilePhoto,
      token: req.headers.authorization?.split(' ')[1] // keep same token
    });
  } else {
    (res as any).status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user details by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (user) {
    (res as any).json(user);
  } else {
    (res as any).status(404);
    throw new Error("User not found");
  }
});

// @desc    Create staff user (Admin only - for receptionist/manager)
// @route   POST /api/users/staff
// @access  Private/Admin
export const createStaffUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, phone, role, password } = req.body;

  if (!name || !email || !password || !role) {
    (res as any).status(400);
    throw new Error('Name, email, password, and role are required');
  }

  const validRoles = ['receptionist', 'manager'];
  if (!validRoles.includes(role)) {
    (res as any).status(400);
    throw new Error(`Role must be one of: ${validRoles.join(', ')}`);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    (res as any).status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash: password,
    role,
    authProvider: 'local',
    isActive: true,
  });

  await logActivity({
    action: ACTIONS.USER_CREATED,
    entityType: 'user',
    entityId: user._id,
    performedBy: req.user._id,
    details: { role, name },
    req,
  });

  (res as any).status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isActive: user.isActive,
  });
});

// @desc    Toggle staff user active/inactive (Admin)
// @route   PATCH /api/users/:id/toggle
// @access  Private/Admin
export const toggleUserActive = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    (res as any).status(404);
    throw new Error("User not found");
  }

  // Cannot deactivate yourself
  if (user._id.toString() === req.user._id.toString()) {
    (res as any).status(400);
    throw new Error("Cannot deactivate your own account");
  }

  user.isActive = !user.isActive;
  await user.save();

  (res as any).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });
});

// @desc    Update user by ID (Admin - update role, details)
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    (res as any).status(404);
    throw new Error("User not found");
  }

  const { name, email, phone, role, address, notes, idProofType, idProofNumber } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (role) user.role = role;
  if (address !== undefined) user.address = address;
  if (notes !== undefined) user.notes = notes;
  if (idProofType) user.idProofType = idProofType;
  if (idProofNumber) user.idProofNumber = idProofNumber;

  const updatedUser = await user.save();

  await logActivity({
    action: ACTIONS.USER_UPDATED,
    entityType: 'user',
    entityId: user._id,
    performedBy: req.user._id,
    details: { updatedFields: Object.keys(req.body) },
    req,
  });

  (res as any).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    isActive: updatedUser.isActive,
    address: updatedUser.address,
    notes: updatedUser.notes,
  });
});