import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/ganerateToken';
import asyncHandler from 'express-async-handler';

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
      token: generateToken(user._id),
    });
  } else {
    (res as any).status(401);
    throw new Error('Invalid email or password');
  }
});