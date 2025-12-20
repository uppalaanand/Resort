
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
  body: any;
  headers: any;
}

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
    });
  } else {
    (res as any).status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.password) {
      user.passwordHash = req.body.password;
    }

    const updatedUser = await user.save();

    (res as any).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: req.headers.authorization?.split(' ')[1] // keep same token
    });
  } else {
    (res as any).status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  (res as any).json(users);
});
