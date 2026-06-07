import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Room from '../models/Room';
import Booking from '../models/Booking';
import BanquetHall from '../models/BanquetHall';

// @desc    Global search across entities
// @route   GET /api/search?q=term
// @access  Private/Admin
export const globalSearch = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || (q as string).trim().length < 2) {
    res.status(400);
    throw new Error('Search query must be at least 2 characters');
  }

  const searchTerm = (q as string).trim();
  const regex = new RegExp(searchTerm, 'i');

  const [users, rooms, bookings, banquets] = await Promise.all([
    User.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
      ],
    })
      .select('name email phone role totalVisits lastStay isActive')
      .limit(10),

    Room.find({
      $or: [
        { name: regex },
        { roomNumber: regex },
      ],
    })
      .select('name roomNumber status isActive pricePerNight images')
      .limit(10),

    Booking.find({
      $or: [
        { guestName: regex },
        { guestPhone: regex },
        { guestEmail: regex },
      ],
    })
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber')
      .populate('banquetHall', 'name')
      .select('type status fromDate toDate totalPrice guestName source')
      .sort({ createdAt: -1 })
      .limit(10),

    BanquetHall.find({
      name: regex,
    })
      .select('name capacity isActive images')
      .limit(10),
  ]);

  res.json({
    users,
    rooms,
    bookings,
    banquets,
    totalResults: users.length + rooms.length + bookings.length + banquets.length,
  });
});
