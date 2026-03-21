import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';
import mongoose from 'mongoose';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
  body: any;
  params: any;
}

// @desc    Create Room Booking
// @route   POST /api/bookings/room
// @access  Private
export const createRoomBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    //Extract data from request body
    const extraBeds = req.body.extraBeds || 0;
    const { roomId, fromDate, toDate, numberOfGuests, specialRequests, requested } = req.body;

    // Validate required fields
    if (!roomId || !fromDate || !toDate || !numberOfGuests) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400);
      throw new Error("Invalid room ID");
    }
    // Validate dates
    const start = new Date(fromDate);
    const end = new Date(toDate);
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400);
      throw new Error("Invalid date format");
    }
    // Check if end date is after start date
    if (end <= start) {
      res.status(400);
      throw new Error("End date must be after start date");
    }
    // Standard hotel timing: 10:00 AM
    start.setUTCHours(12,0,0,0);
    end.setUTCHours(10,0,0,0);

    // Validate number of guests
    if (numberOfGuests <= 0) {
      res.status(400);
      throw new Error("Number of guests must be at least 1");
    }
    // Validate extra beds
    if (extraBeds < 0) {
      res.status(400);
      throw new Error("Extra beds cannot be negative");
    }
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    // Room must be active
    if (!room.isActive) {
      res.status(400);
      throw new Error("This room is not available right now");
    }

    // Validate guests <= maxGuests
    if (numberOfGuests > room.maxGuests) {
      res.status(400);
      throw new Error(`Maximum ${room.maxGuests} guests allowed for this room`);
    }
    // Validate extra beds <= maxExtraBeds
    if (extraBeds > room.maxBeds) {
      res.status(400);
      throw new Error(`Maximum ${room.maxBeds} extra beds allowed`);
    }
    // Check overlapping booking
    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["Pending", "Confirmed"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });
    // If overlapping booking exists → NOT available
    if (overlappingBooking) {
      res.status(400);
      throw new Error("Room is already booked for the selected dates");
    }

    // Calculate price
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    // Assuming extra bed costs 50% of room price per nig
    const totalPrice = days * room.pricePerNight * extraBeds;
    const booking = await Booking.create({
      user: req.user._id,
      type: "room",
      room: roomId,
      fromDate: start,
      toDate: end,
      numberOfGuests,
      specialRequests,
      totalPrice,
      extraBeds,
      requested,
      status: "Pending",
    });
    // Return booking details
    res.status(201).json(booking);
  }
);

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  // Fetch all bookings with user, room, and banquet hall details
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('room', 'name')
    .populate('banquetHall', 'name')
    .sort({ createdAt: -1 });
  // Return bookings
  res.status(200).json(bookings);
});

// @desc    Create Banquet Booking
// @route   POST /api/bookings/banquet
// @access  Private
export const createBanquetBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { banquetHallId, fromDate, toDate, numberOfGuests, eventType, specialRequests } = req.body;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400);
      throw new Error("Invalid date format");
    }
    if (end <= start) {
      res.status(400);
      throw new Error("End date must be after start date");
    }
    const hall = await BanquetHall.findById(banquetHallId);
    if (!hall) {
      res.status(404);
      throw new Error("Banquet Hall not found");
    }
    if (!hall.isActive) {
      res.status(400);
      throw new Error("This banquet hall is not available right now");
    }

    //pending have to do it
    // if (!hall.supportedEvents.includes(eventType)) {
    //   res.status(400);
    //   throw new Error(`This hall does not support the event type: ${eventType}`);
    // }

    if (numberOfGuests > hall.capacity) {
      res.status(400);
      throw new Error(
        `Maximum ${hall.capacity} guests allowed for this banquet hall`
      );
    }

    // Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      banquetHall: banquetHallId,
      status: { $ne: "Cancelled" },
      $or: [
        {
          fromDate: { $lte: end },
          toDate: { $gte: start },
        },
      ],
    });

    if (overlappingBooking) {
      res.status(400);
      throw new Error("Banquet hall is already booked for these dates");
    }
    // const totalPrice = numberOfGuests * hall.pricePerPlate;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      type: "banquet",
      banquetHall: banquetHallId,
      fromDate: start,
      toDate: end,
      numberOfGuests,
      eventType,
      specialRequests,
      // totalPrice,
      status: "Pending", // waiting for payment / admin approval
    });

    res.status(201).json(booking);
  }
);

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


// @desc    Get bookings by user ID (Admin)
// @route   GET /api/admin/bookings/user/:id
// @access  Private/Admin
export const getBookingsByUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    //get user ID from params
    const userId = req.params.id;

    // 1️⃣ Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid User ID");
    }

    //Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    //find bookings for the user
    const bookings = await Booking.find({ user: userId })
      .populate("room")
      .populate("banquetHall")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  }
);


// @desc    Check Avaulaability of a room
// @route   GET /api/bookings/check-availability
// @access  Public
export const checkRoomAvailability = async (req: Request, res: Response) => {
  try {
    //get query params
    const { roomId, fromDate, toDate } = req.query;

    // Validate required parameters
    if (!roomId || !fromDate || !toDate) {
      return res.status(400).json({
        available: false,
        message: 'Missing required parameters'
      });
    }

    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(roomId as string)) {
      return res.status(400).json({
        available: false,
        message: "Invalid room ID"
      });
    }
    
    // Validate room existence
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        available: false,
        message: "Room not found"
      });
    }
    
    // Convert to Date objects
    const checkInDate = new Date(fromDate as string);
    const checkOutDate = new Date(toDate as string);

    // Validate dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        available: false,
        message: "Invalid date format"
      });
    }

    // Check date order
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        available: false,
        message: "Check-out must be after check-in"
      });
    }

    // Standard hotel timing: 10:00 AM
    checkInDate.setUTCHours(12,0,0,0);
    checkOutDate.setUTCHours(10,0,0,0);
    
    const existingBooking = await Booking.findOne({
      type: 'room',
      room: roomId,
      status: { $in: ['Pending', 'Confirmed'] }, // ignore cancelled/completed
      fromDate: { $lt: checkOutDate },
      toDate: { $gt: checkInDate }
    });

    // If booking exists → NOT available
    if (existingBooking) {
      return res.json({ available: false });
    }

    // Else → available
    return res.json({ available: true });

  } catch (error) {
    // console.error('Availability check error:', error);
    return res.status(500).json({
      available: false,
      message: 'Server error'
    });
  }
};