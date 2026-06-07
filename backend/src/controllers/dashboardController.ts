import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Room from '../models/Room';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Parallel queries for performance
  const [
    totalRooms,
    activeRooms,
    occupiedRooms,
    availableRooms,
    maintenanceRooms,
    totalUsers,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    todayCheckIns,
    todayCheckOuts,
    monthlyRevenue,
    totalRevenue,
    recentBookings,
  ] = await Promise.all([
    Room.countDocuments({}),
    Room.countDocuments({ isActive: true }),
    Room.countDocuments({ status: 'Occupied', isActive: true }),
    Room.countDocuments({ status: 'Available', isActive: true }),
    Room.countDocuments({ status: 'Maintenance', isActive: true }),
    User.countDocuments({ role: 'user' }),
    Booking.countDocuments({}),
    Booking.countDocuments({ status: 'Pending' }),
    Booking.countDocuments({ status: 'Confirmed' }),
    // Today's check-ins: confirmed bookings with fromDate = today
    Booking.find({
      status: { $in: ['Confirmed'] },
      fromDate: { $gte: today, $lt: tomorrow },
    }).populate('user', 'name email phone').populate('room', 'name roomNumber').limit(20),
    // Today's check-outs: occupied bookings with toDate = today
    Booking.find({
      checkedInAt: { $ne: null },
      checkedOutAt: null,
      toDate: { $gte: today, $lt: tomorrow },
    }).populate('user', 'name email phone').populate('room', 'name roomNumber').limit(20),
    // Monthly revenue
    Booking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] }, createdAt: { $gte: thisMonthStart, $lt: nextMonthStart } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    // Total revenue
    Booking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    // Recent bookings
    Booking.find({})
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber pricePerNight')
      .populate('banquetHall', 'name')
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const occupancyRate = activeRooms > 0 ? Math.round((occupiedRooms / activeRooms) * 100) : 0;
  console.log(todayCheckIns);
  res.json({
    rooms: {
      total: totalRooms,
      active: activeRooms,
      occupied: occupiedRooms,
      available: availableRooms,
      maintenance: maintenanceRooms,
      occupancyRate,
    },
    users: {
      total: totalUsers,
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
    },
    revenue: {
      monthly: monthlyRevenue[0]?.total || 0,
      total: totalRevenue[0]?.total || 0,
    },
    today: {
      checkIns: todayCheckIns,
      checkOuts: todayCheckOuts,
    },
    recentBookings,
  });
});
