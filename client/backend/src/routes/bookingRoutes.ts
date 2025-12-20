
import express from 'express';
import { 
  createRoomBooking, 
  createBanquetBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBookingStatus, 
  cancelBooking 
} from '../controllers/bookingController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect as any, admin as any, getAllBookings as any);
router.route('/room').post(protect as any, createRoomBooking as any);
router.route('/banquet').post(protect as any, createBanquetBooking as any);
router.route('/my').get(protect as any, getMyBookings as any);
router.route('/:id/status').patch(protect as any, admin as any, updateBookingStatus as any);
router.route('/:id/cancel').patch(protect as any, cancelBooking as any);

export default router;
