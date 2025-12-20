
import express from 'express';
import { getBanquets, getBanquetById, createBanquet, updateBanquet, deleteBanquet } from '../controllers/banquetController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getBanquets as any)
  .post(protect as any, admin as any, createBanquet as any);

router.route('/:id')
  .get(getBanquetById as any)
  .put(protect as any, admin as any, updateBanquet as any)
  .delete(protect as any, admin as any, deleteBanquet as any);

export default router;
