import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { createRoomBooking, getAllBookings, createBanquetBooking, getMyBookings, cancelBooking, updateBookingStatus, getBookingsByUser, checkRoomAvailability } from '../controllers/bookingController';

const router = express.Router();

router.route('/').get(protect as any, admin as any, getAllBookings as any);
router.route('/room').post(protect as any, createRoomBooking as any);
router.route('/banquet').post(protect as any, createBanquetBooking as any);
router.route('/my').get(protect as any, getMyBookings as any);
router.route('/:id/cancel').patch(protect as any, cancelBooking as any);
router.route('/:id/status').patch(protect as any, admin as any, updateBookingStatus as any);
router.get("/user/:id", protect as any, admin as any, getBookingsByUser as any);
router.get('/check-availability', checkRoomAvailability as any);
export default router;