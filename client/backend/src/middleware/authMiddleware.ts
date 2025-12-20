
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
  headers: any;
}

// Protect routes
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
        next();
      } else {
        (res as any).status(401);
        throw new Error('Not authorized, user not found');
      }
    } catch (error) {
      (res as any).status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    (res as any).status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    (res as any).status(401);
    throw new Error('Not authorized as an admin');
  }
};
