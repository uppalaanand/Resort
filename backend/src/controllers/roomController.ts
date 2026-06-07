import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Room from '../models/Room';
import Booking from '../models/Booking';
import { deleteCache, getCache, setCache } from '../utils/cache';
import { logActivity, ACTIONS } from '../utils/activityLogger';

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

// @desc    Toggle room active/inactive
// @route   PATCH /api/rooms/:id/toggle
// @access  Private/Admin
export const toggleRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    (res as any).status(404);
    throw new Error("Room not found");
  }

  room.isActive = !room.isActive;
  await room.save();

  await deleteCache(`room:${room._id}`);
  await deleteCache('rooms:all');

  await logActivity({
    action: ACTIONS.ROOM_TOGGLED,
    entityType: 'room',
    entityId: room._id,
    performedBy: (req as any).user?._id,
    details: { isActive: room.isActive },
    req,
  });

  (res as any).json(room);
});

// @desc    Update room status (Available/Reserved/Occupied/Maintenance/Cleaning)
// @route   PATCH /api/rooms/:id/status
// @access  Private/Receptionist+Admin
export const updateRoomStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['Available', 'Reserved', 'Occupied', 'Maintenance', 'Cleaning'];

  if (!validStatuses.includes(status)) {
    (res as any).status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const room = await Room.findById(req.params.id);
  if (!room) {
    (res as any).status(404);
    throw new Error("Room not found");
  }

  room.status = status;
  if (status === 'Available' || status === 'Maintenance' || status === 'Cleaning') {
    room.currentBooking = undefined;
  }
  await room.save();

  await deleteCache(`room:${room._id}`);
  await deleteCache('rooms:all');

  await logActivity({
    action: ACTIONS.ROOM_STATUS_CHANGED,
    entityType: 'room',
    entityId: room._id,
    performedBy: (req as any).user?._id,
    details: { status },
    req,
  });

  (res as any).json(room);
});

// @desc    Get all rooms (Admin - includes inactive)
// @route   GET /api/rooms/admin/all
// @access  Private/Admin
export const getAllRoomsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const rooms = await Room.find({}).populate('currentBooking', 'guestName fromDate toDate status');
  (res as any).json(rooms);
});

// @desc    Get room occupancy summary
// @route   GET /api/rooms/occupancy
// @access  Private/Receptionist+Admin
export const getRoomOccupancy = asyncHandler(async (req: Request, res: Response) => {
  const rooms = await Room.find({ isActive: true })
    .select('name roomNumber status floor currentBooking images')
    .populate('currentBooking', 'guestName guestPhone fromDate toDate numberOfGuests user status')
    .sort({ roomNumber: 1 });

  const summary = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    reserved: rooms.filter(r => r.status === 'Reserved').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    cleaning: rooms.filter(r => r.status === 'Cleaning').length,
    rooms,
  };

  (res as any).json(summary);
});

// @desc    Get room history (past guests)
// @route   GET /api/rooms/:id/history
// @access  Private/Admin
export const getRoomHistory = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.id;

  const room = await Room.findById(roomId);
  if (!room) {
    (res as any).status(404);
    throw new Error("Room not found");
  }

  const history = await Booking.find({ 
    room: roomId, 
    status: { $in: ['Completed', 'Confirmed'] }
  })
    .populate('user', 'name email phone')
    .sort({ fromDate: -1 })
    .limit(100);

  (res as any).json({ room: { name: room.name, roomNumber: room.roomNumber }, history });
});

