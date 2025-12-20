import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { createBanquet, deleteBanquet, getBanquetById, getBanquets, updateBanquete } from '../controllers/banquetController';
import upload from '../middleware/upload';

const router = express.Router();

router.route('/')
    .get(getBanquets as any)
    .post(protect as any, admin as any, createBanquet as any);
    // .post(protect as any, admin as any, upload.array('images', 10), createBanquet as any);

router.route('/:id')
    .get(getBanquetById as any)
    .patch(protect as any, admin as any, updateBanquete as any)
    // .patch(protect as any, admin as any, upload.array('images', 10), updateBanquete as any)
    .delete(protect as any, admin as any, deleteBanquet as any);

export default router;