import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Room from '../models/Room';

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  const images = files.map(file => file.path);

  const newRoom = await Room.create({
    ...req.body,
    images,
  });

  (res as any).status(201).json(newRoom);
});

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
  const room = await Room.findById(req.params.id);
  if(room) {
    (res as any).json(room);
  }else{
    (res as any).status(404);
    throw new Error('Room not found');
  }
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    (res as any).status(404);
    throw new Error("Room not found");
  }
  Object.assign(room, (req as any).body);

  const files = (req as any).files as Express.Multer.File[];
  if (files && files.length > 0) {
    room.images = files.map((file) => file.path); // overwrite old images
  }
  const updatedRoom = await room.save();
  (res as any).json(updatedRoom);
});

// @desc    Delete a room (Soft delete)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    room.isActive = false;
    await room.save();
    (res as any).json({ message: "Room removed (soft delete)" });
  }else{
    (res as any).status(404);
    throw new Error("Room not found");
  }
})
