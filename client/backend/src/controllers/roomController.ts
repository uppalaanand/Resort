
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Room from '../models/Room';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const rooms = await Room.find({ isActive: true });
  (res as any).json(rooms);
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById((req as any).params.id);
  if (room) {
    (res as any).json(room);
  } else {
    (res as any).status(404);
    throw new Error('Room not found');
  }
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = new Room((req as any).body);
  const createdRoom = await room.save();
  (res as any).status(201).json(createdRoom);
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById((req as any).params.id);

  if (room) {
    Object.assign(room, (req as any).body);
    const updatedRoom = await room.save();
    (res as any).json(updatedRoom);
  } else {
    (res as any).status(404);
    throw new Error('Room not found');
  }
});

// @desc    Delete a room (Soft delete)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById((req as any).params.id);

  if (room) {
    room.isActive = false;
    await room.save();
    (res as any).json({ message: 'Room removed (soft delete)' });
  } else {
    (res as any).status(404);
    throw new Error('Room not found');
  }
});
