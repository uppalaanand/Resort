
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';

interface AuthRequest extends Request {
  user?: any;
  body: any;
  params: any;
}

// @desc    Create Room Booking
// @route   POST /api/bookings/room
// @access  Private
export const createRoomBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { roomId, fromDate, toDate, numberOfGuests, specialRequests } = req.body;

  if (new Date(toDate) <= new Date(fromDate)) {
    (res as any).status(400);
    throw new Error('End date must be after start date');
  }

  const room = await Room.findById(roomId);
  if (!room) {
    (res as any).status(404);
    throw new Error('Room not found');
  }

  // Calculate approximate price (simplified)
  const days = Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = days * room.pricePerNight;

  const booking = await Booking.create({
    user: req.user._id,
    type: 'room',
    room: roomId,
    fromDate,
    toDate,
    numberOfGuests,
    specialRequests,
    totalPrice,
    status: 'Pending'
  });

  (res as any).status(201).json(booking);
});

// @desc    Create Banquet Booking
// @route   POST /api/bookings/banquet
// @access  Private
export const createBanquetBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { banquetHallId, fromDate, toDate, numberOfGuests, eventType, specialRequests } = req.body;

  const hall = await BanquetHall.findById(banquetHallId);
  if (!hall) {
    (res as any).status(404);
    throw new Error('Banquet Hall not found');
  }

  // Simplified price logic
  const totalPrice = numberOfGuests * hall.pricePerPlate;

  const booking = await Booking.create({
    user: req.user._id,
    type: 'banquet',
    banquetHall: banquetHallId,
    fromDate,
    toDate,
    numberOfGuests,
    eventType,
    specialRequests,
    totalPrice,
    status: 'Pending'
  });

  (res as any).status(201).json(booking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('room', 'name images')
    .populate('banquetHall', 'name images')
    .sort({ createdAt: -1 });
  (res as any).json(bookings);
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('room', 'name')
    .populate('banquetHall', 'name')
    .sort({ createdAt: -1 });
  (res as any).json(bookings);
});

// @desc    Update Booking Status (Admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = (req as any).body;
  const booking = await Booking.findById((req as any).params.id);

  if (booking) {
    booking.status = status;
    const updatedBooking = await booking.save();
    (res as any).json(updatedBooking);
  } else {
    (res as any).status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Cancel Booking (User)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    (res as any).status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    (res as any).status(401);
    throw new Error('Not authorized');
  }

  if (booking.status === 'Completed' || booking.status === 'Cancelled') {
    (res as any).status(400);
    throw new Error('Cannot cancel completed or already cancelled booking');
  }

  booking.status = 'Cancelled';
  await booking.save();
  (res as any).json({ message: 'Booking cancelled' });
});
