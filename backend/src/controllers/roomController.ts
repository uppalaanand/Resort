import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Room from '../models/Room';
import { deleteCache, getCache, setCache } from '../utils/cache';

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  const images = files.map(file => file.path);
  //Create new room with image paths
  const newRoom = await Room.create({
    ...req.body,
    images,
  });
  // Invalidate cache for rooms list
  await deleteCache('rooms:all');

  (res as any).status(201).json(newRoom);
});

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  // Define a cache key for all rooms
  const cacheKey = 'rooms:all';
  // Try to get cached data from Redis
  const cachedRooms = await getCache(cacheKey);
  // If cached data exists, return it
  if(cachedRooms) {
    // console.log('Serving rooms from cache');
    return (res as any).json(cachedRooms);
  }
  // If no cache, fetch from database
  const rooms = await Room.find({ isActive: true });
  // Cache the result in Redis with an expiration time (e.g., 1 hour)
  await setCache(cacheKey, rooms, 3600);
  // console.log('Serving rooms from database');
  return (res as any).json(rooms);
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.id;
  // Define a cache key for this room
  const cacheKey = `room:${roomId}`;
  // Try to get cached data from Redis
  const cachedRoom = await getCache(cacheKey);
  // If cached data exists, return it
  if(cachedRoom) {
    // console.log(`Serving room ${roomId} from cache`);
    return (res as any).json(cachedRoom);
  }
  // If no cache, fetch from database
  const room = await Room.findById(roomId);
  if(!room) {
    (res as any).status(404);
    throw new Error('Room not found');
  }
  // Cache the result in Redis with an expiration time (e.g., 1 hour)
  await setCache(cacheKey, room, 3600);
  // console.log(`Serving room ${roomId} from database`);
  return (res as any).json(room);
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
  //Saeve updated room
  const updatedRoom = await room.save();
  // Invalidate cache for this room and rooms list
  await deleteCache(`room:${room._id}`);
  await deleteCache('rooms:all');

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
    // Invalidate cache for this room and rooms list
    await deleteCache(`room:${room._id}`);
    await deleteCache('rooms:all');

    (res as any).json({ message: "Room removed (soft delete)" });
  }else{
    (res as any).status(404);
    throw new Error("Room not found");
  }
})
