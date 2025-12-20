
import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getRooms as any)
  .post(protect as any, admin as any, createRoom as any);

router.route('/:id')
  .get(getRoomById as any)
  .put(protect as any, admin as any, updateRoom as any)
  .delete(protect as any, admin as any, deleteRoom as any);

export default router;
