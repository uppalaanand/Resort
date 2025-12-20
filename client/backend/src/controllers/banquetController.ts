
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import BanquetHall from '../models/BanquetHall';

// @desc    Get all banquets
// @route   GET /api/banquets
// @access  Public
export const getBanquets = asyncHandler(async (req: Request, res: Response) => {
  const banquets = await BanquetHall.find({ isActive: true });
  (res as any).json(banquets);
});

// @desc    Get banquet by ID
// @route   GET /api/banquets/:id
// @access  Public
export const getBanquetById = asyncHandler(async (req: Request, res: Response) => {
  const banquet = await BanquetHall.findById((req as any).params.id);
  if (banquet) {
    (res as any).json(banquet);
  } else {
    (res as any).status(404);
    throw new Error('Banquet Hall not found');
  }
});

// @desc    Create a banquet
// @route   POST /api/banquets
// @access  Private/Admin
export const createBanquet = asyncHandler(async (req: Request, res: Response) => {
  const banquet = new BanquetHall((req as any).body);
  const createdBanquet = await banquet.save();
  (res as any).status(201).json(createdBanquet);
});

// @desc    Update a banquet
// @route   PUT /api/banquets/:id
// @access  Private/Admin
export const updateBanquet = asyncHandler(async (req: Request, res: Response) => {
  const banquet = await BanquetHall.findById((req as any).params.id);

  if (banquet) {
    Object.assign(banquet, (req as any).body);
    const updatedBanquet = await banquet.save();
    (res as any).json(updatedBanquet);
  } else {
    (res as any).status(404);
    throw new Error('Banquet Hall not found');
  }
});

// @desc    Delete a banquet
// @route   DELETE /api/banquets/:id
// @access  Private/Admin
export const deleteBanquet = asyncHandler(async (req: Request, res: Response) => {
  const banquet = await BanquetHall.findById((req as any).params.id);
  if (banquet) {
    banquet.isActive = false;
    await banquet.save();
    (res as any).json({ message: 'Banquet Hall removed' });
  } else {
    (res as any).status(404);
    throw new Error('Banquet Hall not found');
  }
});
