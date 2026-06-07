import express from 'express';
import { protect, admin, receptionistOrAdmin } from '../middleware/authMiddleware';
import { 
  createRoomBooking, getAllBookings, createBanquetBooking, getMyBookings, 
  cancelBooking, updateBookingStatus, getBookingsByUser, checkRoomAvailability, 
  getBookedDates, getBookingById, approveBooking, rejectBooking, 
  createOfflineBooking, checkInGuest, checkOutGuest, updatePaymentStatus
} from '../controllers/bookingController';

const router = express.Router();

router.route('/').get(protect as any, admin as any, getAllBookings as any);
router.route('/room').post(protect as any, createRoomBooking as any);
router.route('/banquet').post(protect as any, createBanquetBooking as any);
router.route('/offline').post(protect as any, receptionistOrAdmin as any, createOfflineBooking as any);
router.route('/my').get(protect as any, getMyBookings as any);
router.get("/user/:id", protect as any, admin as any, getBookingsByUser as any);
router.get('/check-availability', checkRoomAvailability as any);
router.get('/booked-dates', getBookedDates as any);
router.route('/:id').get(protect as any, receptionistOrAdmin as any, getBookingById as any);
router.route('/:id/cancel').patch(protect as any, cancelBooking as any);
router.route('/:id/status').patch(protect as any, admin as any, updateBookingStatus as any);
router.route('/:id/approve').patch(protect as any, admin as any, approveBooking as any);
router.route('/:id/reject').patch(protect as any, admin as any, rejectBooking as any);
router.route('/:id/checkin').patch(protect as any, receptionistOrAdmin as any, checkInGuest as any);
router.route('/:id/checkout').patch(protect as any, receptionistOrAdmin as any, checkOutGuest as any);
router.route('/:id/payment').patch(protect as any, admin as any, updatePaymentStatus as any);

export default router;