import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';
import mongoose from 'mongoose';
import User from '../models/User';
import { deleteCache, getCache, setCache } from '../utils/cache';
import { logActivity, ACTIONS } from '../utils/activityLogger';
import { emailService } from '../services/emailService';

interface AuthRequest extends Request {
  user?: any;
  body: any;
  params: any;
}

const EXTRA_BED_RATE = 1000; // ₹1000 per extra bed per night

// @desc    Create Room Booking (Online)
// @route   POST /api/bookings/room
// @access  Private
export const createRoomBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const extraBeds = req.body.extraBeds || 0;
    const { roomId, fromDate, toDate, numberOfGuests, specialRequests, requested } = req.body;

    if (!roomId || !fromDate || !toDate || !numberOfGuests) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400);
      throw new Error("Invalid room ID");
    }

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

    start.setUTCHours(12,0,0,0);
    end.setUTCHours(10,0,0,0);

    if (numberOfGuests <= 0) {
      res.status(400);
      throw new Error("Number of guests must be at least 1");
    }
    if (extraBeds < 0) {
      res.status(400);
      throw new Error("Extra beds cannot be negative");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    if (!room.isActive) {
      res.status(400);
      throw new Error("This room is not available right now");
    }

    if (numberOfGuests > room.maxGuests) {
      res.status(400);
      throw new Error(`Maximum ${room.maxGuests} guests allowed for this room`);
    }
    if (extraBeds > room.maxBeds) {
      res.status(400);
      throw new Error(`Maximum ${room.maxBeds} extra beds allowed`);
    }

    // Double-booking prevention
    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["Pending", "Confirmed"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlappingBooking) {
      res.status(400);
      throw new Error("Room is already booked for the selected dates");
    }

    // FIX: Correct price calculation — base room cost + extra bed cost
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const effectivePrice = room.discountPrice && room.discountPrice < room.pricePerNight 
      ? room.discountPrice 
      : room.pricePerNight;
    const totalPrice = (days * effectivePrice) + (extraBeds * EXTRA_BED_RATE * days);

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
      source: "ONLINE",
      paymentStatus: "Pending",
    });

    // Activity log
    await logActivity({
      action: ACTIONS.BOOKING_CREATED,
      entityType: 'booking',
      entityId: booking._id,
      performedBy: req.user._id,
      details: { roomId, source: 'ONLINE', totalPrice },
      req,
    });

    // Invalidate cache
    const cacheKey = `bookedDates:room:${roomId}`;
    await deleteCache(cacheKey);

    res.status(201).json(booking);
  }
);

// @desc    Get all bookings (Admin/Receptionist)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, type, page, limit: limitStr } = req.query;
  
  const filter: any = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (type) filter.type = type;

  const bookings = await Booking.find(filter)
    .populate('user', 'name email phone')
    .populate('room', 'name discountPrice pricePerNight roomNumber images')
    .populate('banquetHall', 'name images')
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private/Admin
export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone address idProofType idProofNumber')
    .populate('room', 'name discountPrice pricePerNight roomNumber images status')
    .populate('banquetHall', 'name images')
    .populate('approvedBy', 'name')
    .populate('checkedInBy', 'name')
    .populate('checkedOutBy', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.status(200).json(booking);
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

    if (numberOfGuests > hall.capacity) {
      res.status(400);
      throw new Error(`Maximum ${hall.capacity} guests allowed for this banquet hall`);
    }

    const overlappingBooking = await Booking.findOne({
      banquetHall: banquetHallId,
      status: { $in: ["Pending", "Confirmed"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlappingBooking) {
      res.status(400);
      throw new Error("Banquet hall is already booked for these dates");
    }

    const booking = await Booking.create({
      user: req.user._id,
      type: "banquet",
      banquetHall: banquetHallId,
      fromDate: start,
      toDate: end,
      numberOfGuests,
      eventType,
      specialRequests,
      status: "Pending",
      source: "ONLINE",
      paymentStatus: "Pending",
    });

    await logActivity({
      action: ACTIONS.BOOKING_CREATED,
      entityType: 'booking',
      entityId: booking._id,
      performedBy: req.user._id,
      details: { banquetHallId, source: 'ONLINE' },
      req,
    });

    const cacheKey = `bookedDates:banquet:${banquetHallId}`;
    await deleteCache(cacheKey);

    res.status(201).json(booking);
  }
);

// @desc    Create Offline/Walk-in Booking (Receptionist)
// @route   POST /api/bookings/offline
// @access  Private/Receptionist+Admin
export const createOfflineBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    roomId, fromDate, toDate, numberOfGuests, specialRequests, extraBeds: extraBedsInput,
    guestName, guestPhone, guestEmail, guestAddress,
    idProofType, idProofNumber, paymentMethod, notes, occupancy
  } = req.body;

  const extraBeds = extraBedsInput || 0;

  if (!roomId || !fromDate || !toDate || !numberOfGuests || !guestName || !guestPhone) {
    res.status(400);
    throw new Error("Missing required fields: roomId, fromDate, toDate, numberOfGuests, guestName, guestPhone");
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400);
    throw new Error("Invalid room ID");
  }

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

  start.setUTCHours(12,0,0,0);
  end.setUTCHours(10,0,0,0);

  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  if (!room.isActive) {
    res.status(400);
    throw new Error("This room is not available right now");
  }

  // Double-booking prevention
  const overlappingBooking = await Booking.findOne({
    room: roomId,
    status: { $in: ["Pending", "Confirmed"] },
    fromDate: { $lte: end },
    toDate: { $gte: start },
  });

  if (overlappingBooking) {
    res.status(400);
    throw new Error("Room is already booked for the selected dates");
  }

  // Auto-create or find user by phone/email
  let userId: mongoose.Types.ObjectId | undefined;
  if (guestEmail || guestPhone) {
    let existingUser = guestEmail 
      ? await User.findOne({ email: guestEmail })
      : await User.findOne({ phone: guestPhone });

    if (existingUser) {
      userId = existingUser._id as mongoose.Types.ObjectId;
      // Update guest info if missing
      if (!existingUser.address && guestAddress) existingUser.address = guestAddress;
      if (!existingUser.idProofType && idProofType) existingUser.idProofType = idProofType;
      if (!existingUser.idProofNumber && idProofNumber) existingUser.idProofNumber = idProofNumber;
      await existingUser.save();
    } else if (guestEmail) {
      // Create new user for the guest
      const newUser = await User.create({
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        address: guestAddress,
        idProofType,
        idProofNumber,
        role: 'user',
        authProvider: 'local',
      });
      userId = newUser._id as mongoose.Types.ObjectId;

      await logActivity({
        action: ACTIONS.USER_CREATED,
        entityType: 'user',
        entityId: newUser._id,
        performedBy: req.user._id,
        details: { source: 'OFFLINE_BOOKING', guestName },
        req,
      });
    }
  }

  // Calculate price
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const effectivePrice = room.discountPrice && room.discountPrice < room.pricePerNight 
    ? room.discountPrice 
    : room.pricePerNight;
  const totalPrice = (days * effectivePrice) + (extraBeds * EXTRA_BED_RATE * days);

  const booking = await Booking.create({
    user: userId,
    type: "room",
    room: roomId,
    fromDate: start,
    toDate: end,
    numberOfGuests,
    specialRequests,
    totalPrice,
    extraBeds,
    status: "Confirmed", // Offline bookings are auto-confirmed
    source: "OFFLINE",
    paymentMethod,
    paymentStatus: paymentMethod ? "Paid" : "Pending",
    guestName,
    guestPhone,
    guestEmail,
    guestAddress,
    idProofType,
    idProofNumber,
    occupancy,
    notes,
  });

  // Update room status to Reserved
  room.status = 'Reserved';
  room.currentBooking = booking._id as mongoose.Types.ObjectId;
  await room.save();

  await logActivity({
    action: ACTIONS.OFFLINE_BOOKING_CREATED,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { roomId, guestName, source: 'OFFLINE', totalPrice },
    req,
  });

  const cacheKey = `bookedDates:room:${roomId}`;
  await deleteCache(cacheKey);
  await deleteCache('rooms:all');

  res.status(201).json(booking);
});

// @desc    Approve Booking (Admin)
// @route   PATCH /api/bookings/:id/approve
// @access  Private/Admin
export const approveBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'Pending') {
    res.status(400);
    throw new Error(`Cannot approve a booking with status: ${booking.status}`);
  }

  booking.status = 'Confirmed';
  booking.approvedBy = req.user._id;
  await booking.save();

  // Update room status
  if (booking.type === 'room' && booking.room) {
    await Room.findByIdAndUpdate(booking.room._id || booking.room, {
      status: 'Reserved',
      currentBooking: booking._id,
    });
    await deleteCache(`rooms:all`);
    await deleteCache(`room:${booking.room._id || booking.room}`);
  }

  // Send confirmation email
  const user = booking.user as any;
  const room = booking.room as any;
  if (user?.email) {
    await emailService.sendBookingConfirmation(user.email, {
      guestName: user.name || booking.guestName || 'Guest',
      roomName: room?.name || 'Your Booking',
      checkIn: new Date(booking.fromDate).toDateString(),
      checkOut: new Date(booking.toDate).toDateString(),
      bookingId: booking._id.toString(),
    });
  }

  await logActivity({
    action: ACTIONS.BOOKING_APPROVED,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { previousStatus: 'Pending' },
    req,
  });

  // FIX: Use correct room/banquet ID for cache key
  if (booking.type === 'room' && booking.room) {
    await deleteCache(`bookedDates:room:${booking.room._id || booking.room}`);
  } else if (booking.banquetHall) {
    await deleteCache(`bookedDates:banquet:${booking.banquetHall}`);
  }

  res.status(200).json(booking);
});

// @desc    Reject Booking (Admin)
// @route   PATCH /api/bookings/:id/reject
// @access  Private/Admin
export const rejectBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { reason } = req.body;
  
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'Pending') {
    res.status(400);
    throw new Error(`Cannot reject a booking with status: ${booking.status}`);
  }

  booking.status = 'Rejected';
  booking.rejectionReason = reason || '';
  await booking.save();

  // Send rejection email
  const user = booking.user as any;
  const room = booking.room as any;
  if (user?.email) {
    await emailService.sendBookingRejection(user.email, {
      guestName: user.name || booking.guestName || 'Guest',
      roomName: room?.name || 'Your Booking',
      reason,
      bookingId: booking._id.toString(),
    });
  }

  await logActivity({
    action: ACTIONS.BOOKING_REJECTED,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { reason },
    req,
  });

  // FIX: Use correct room/banquet ID for cache key
  if (booking.type === 'room' && booking.room) {
    await deleteCache(`bookedDates:room:${booking.room._id || booking.room}`);
  } else if (booking.banquetHall) {
    await deleteCache(`bookedDates:banquet:${booking.banquetHall}`);
  }

  res.status(200).json(booking);
});

// @desc    Check-in Guest
// @route   PATCH /api/bookings/:id/checkin
// @access  Private/Receptionist+Admin
export const checkInGuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'Confirmed') {
    res.status(400);
    throw new Error(`Cannot check in - booking status is: ${booking.status}. Must be Confirmed.`);
  }

  booking.checkedInAt = new Date();
  booking.checkedInBy = req.user._id;
  await booking.save();

  // Update room status to Occupied
  if (booking.type === 'room' && booking.room) {
    const roomId = (booking.room as any)._id || booking.room;
    await Room.findByIdAndUpdate(roomId, {
      status: 'Occupied',
      currentBooking: booking._id,
    });
    await deleteCache(`rooms:all`);
    await deleteCache(`room:${roomId}`);
  }

  // Send check-in confirmation email
  const user = booking.user as any;
  const room = booking.room as any;
  if (user?.email) {
    await emailService.sendCheckInConfirmation(user.email, {
      guestName: user.name || booking.guestName || 'Guest',
      roomName: room?.name || 'Your Room',
      roomNumber: room?.roomNumber,
      checkOut: new Date(booking.toDate).toDateString(),
    });
  }

  await logActivity({
    action: ACTIONS.GUEST_CHECKIN,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { roomId: booking.room },
    req,
  });

  res.status(200).json(booking);
});

// @desc    Check-out Guest
// @route   PATCH /api/bookings/:id/checkout
// @access  Private/Receptionist+Admin
export const checkOutGuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('room', 'name roomNumber');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (!booking.checkedInAt) {
    res.status(400);
    throw new Error('Guest has not checked in yet');
  }

  if (booking.checkedOutAt) {
    res.status(400);
    throw new Error('Guest has already checked out');
  }

  booking.checkedOutAt = new Date();
  booking.checkedOutBy = req.user._id;
  booking.status = 'Completed';
  await booking.save();

  // Update room status to Cleaning, then Available
  if (booking.type === 'room' && booking.room) {
    const roomId = (booking.room as any)._id || booking.room;
    await Room.findByIdAndUpdate(roomId, {
      status: 'Cleaning',
      currentBooking: null,
    });
    await deleteCache(`rooms:all`);
    await deleteCache(`room:${roomId}`);
    await deleteCache(`bookedDates:room:${roomId}`);
  }

  // Update user stats
  if (booking.user) {
    await User.findByIdAndUpdate(booking.user, {
      $inc: { totalVisits: 1, totalSpend: booking.totalPrice || 0 },
      lastStay: new Date(),
    });
  }

  await logActivity({
    action: ACTIONS.GUEST_CHECKOUT,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { roomId: booking.room, totalPrice: booking.totalPrice },
    req,
  });

  res.status(200).json(booking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('room', 'name images roomNumber')
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

  if (booking.user && booking.user.toString() !== req.user._id.toString()) {
    (res as any).status(401);
    throw new Error('Not authorized');
  }

  if (booking.status === 'Completed' || booking.status === 'Cancelled') {
    (res as any).status(400);
    throw new Error('Cannot cancel completed or already cancelled booking');
  }

  booking.status = 'Cancelled';
  await booking.save();

  // Update room status back to Available
  if (booking.type === 'room' && booking.room) {
    const roomId = booking.room.toString();
    await Room.findByIdAndUpdate(roomId, {
      status: 'Available',
      currentBooking: null,
    });
    // FIX: Use correct room ID (not booking ID) for cache key
    await deleteCache(`bookedDates:room:${roomId}`);
    await deleteCache(`rooms:all`);
    await deleteCache(`room:${roomId}`);
  } else if (booking.banquetHall) {
    // FIX: Use correct banquet ID (not booking ID) for cache key
    await deleteCache(`bookedDates:banquet:${booking.banquetHall.toString()}`);
  }

  await logActivity({
    action: ACTIONS.BOOKING_CANCELLED,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    req,
  });

  (res as any).json({ message: 'Booking cancelled' });
});

// @desc    Update Booking Status (Admin) - Legacy endpoint
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = (req as any).body;
  const booking = await Booking.findById((req as any).params.id);

  if (booking) {
    booking.status = status;
    const updatedBooking = await booking.save();

    // FIX: Use correct room/banquet ID for cache invalidation
    if (booking.type === 'room' && booking.room) {
      const roomId = booking.room.toString();
      await deleteCache(`bookedDates:room:${roomId}`);

      // Update room status based on booking status
      if (status === 'Confirmed') {
        await Room.findByIdAndUpdate(roomId, { status: 'Reserved', currentBooking: booking._id });
      } else if (status === 'Cancelled' || status === 'Completed' || status === 'Rejected') {
        await Room.findByIdAndUpdate(roomId, { status: 'Available', currentBooking: null });
      }
      await deleteCache(`rooms:all`);
      await deleteCache(`room:${roomId}`);
    } else if (booking.banquetHall) {
      await deleteCache(`bookedDates:banquet:${booking.banquetHall.toString()}`);
    }

    (res as any).json(updatedBooking);
  } else {
    (res as any).status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Update Payment Status
// @route   PATCH /api/bookings/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentStatus, paymentMethod } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (paymentStatus) booking.paymentStatus = paymentStatus;
  if (paymentMethod) booking.paymentMethod = paymentMethod;
  await booking.save();

  await logActivity({
    action: ACTIONS.PAYMENT_UPDATED,
    entityType: 'booking',
    entityId: booking._id,
    performedBy: req.user._id,
    details: { paymentStatus, paymentMethod },
    req,
  });

  res.status(200).json(booking);
});

// @desc    Get bookings by user ID (Admin)
// @route   GET /api/bookings/user/:id
// @access  Private/Admin
export const getBookingsByUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid User ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const bookings = await Booking.find({ user: userId })
      .populate("room", "name images roomNumber pricePerNight")
      .populate("banquetHall", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  }
);

// @desc    Check Availability of a room
// @route   GET /api/bookings/check-availability
// @access  Public
export const checkRoomAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId, fromDate, toDate } = req.query;

    if (!roomId || !fromDate || !toDate) {
      return res.status(400).json({
        available: false,
        message: 'Missing required parameters'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId as string)) {
      return res.status(400).json({
        available: false,
        message: "Invalid room ID"
      });
    }
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        available: false,
        message: "Room not found"
      });
    }
    
    const checkInDate = new Date(fromDate as string);
    const checkOutDate = new Date(toDate as string);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        available: false,
        message: "Invalid date format"
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        available: false,
        message: "Check-out must be after check-in"
      });
    }

    checkInDate.setUTCHours(12,0,0,0);
    checkOutDate.setUTCHours(10,0,0,0);
    
    const existingBooking = await Booking.findOne({
      type: 'room',
      room: roomId,
      status: { $in: ['Pending', 'Confirmed'] },
      fromDate: { $lt: checkOutDate },
      toDate: { $gt: checkInDate }
    });

    if (existingBooking) {
      return res.json({ available: false });
    }

    return res.json({ available: true });

  } catch (error) {
    return res.status(500).json({
      available: false,
      message: 'Server error'
    });
  }
};

// @desc    Get booked dates for a room or banquet hall
// @route   GET /api/bookings/booked-dates?type=room/banquet&id=xxx
// @access  Public
export const getBookedDates = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.query;

    if (!id || !type) {
      return res.status(400).json({ message: "Missing id or type" });
    }
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    if (type !== "room" && type !== "banquet") {
      return res.status(400).json({ message: "Invalid type" });
    }

    const cacheKey = `bookedDates:${type}:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const query: any = {
      type,
      status: { $in: ["Pending", "Confirmed"] },
    };
    if (type === "room") {
      query.room = id;
    } else {
      query.banquetHall = id;
    }

    const bookings = await Booking.find(query);
    let bookedDates: string[] = [];

    bookings.forEach((booking) => {
      let current = new Date(booking.fromDate);
      const end = new Date(booking.toDate);

      while (current < end) {
        bookedDates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    bookedDates = [...new Set(bookedDates)];
    await setCache(cacheKey, bookedDates, 3600);

    return res.json(bookedDates);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};