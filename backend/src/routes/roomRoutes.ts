import express from 'express';

import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom, toggleRoom, updateRoomStatus, getAllRoomsAdmin, getRoomOccupancy, getRoomHistory } from '../controllers/roomController';
import { protect, admin, receptionistOrAdmin } from '../middleware/authMiddleware';
import { uploadRoom } from '../middleware/upload';

const router = express.Router();

router.route('/')
    .get(getRooms as any)
    .post(protect as any, admin as any, uploadRoom.array('images', 10), createRoom as any);

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', protect as any, admin as any, getAllRoomsAdmin as any);
router.get('/occupancy', protect as any, receptionistOrAdmin as any, getRoomOccupancy as any);

router.route('/:id')
    .get(getRoomById as any)
    .patch(protect as any, admin as any, uploadRoom.array('images', 10), updateRoom as any)
    .delete(protect as any, admin as any, deleteRoom as any);

router.patch('/:id/toggle', protect as any, admin as any, toggleRoom as any);
router.patch('/:id/status', protect as any, receptionistOrAdmin as any, updateRoomStatus as any);
router.get('/:id/history', protect as any, admin as any, getRoomHistory as any);

export default router;