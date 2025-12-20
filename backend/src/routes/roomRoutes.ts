import express from 'express';

import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom } from '../controllers/roomController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = express.Router();

router.route('/')
    .get(getRooms as any)
    .post(protect as any, admin as any, createRoom as any);

router.route('/:id')
    .get(getRoomById as any)
    .patch(protect as any, admin as any, updateRoom as any)
    .delete(protect as any, admin as any, deleteRoom as any);

export default router;