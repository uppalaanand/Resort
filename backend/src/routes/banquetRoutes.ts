import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { createBanquet, deleteBanquet, getBanquetById, getBanquets, updateBanquete, toggleBanquet, getAllBanquetsAdmin } from '../controllers/banquetController';
import { uploadBanquete } from '../middleware/upload';

const router = express.Router();

router.route('/')
    .get(getBanquets as any)
    .post(protect as any, admin as any, uploadBanquete.array('images', 10), createBanquet as any);

// Admin routes (must be before /:id)
router.get('/admin/all', protect as any, admin as any, getAllBanquetsAdmin as any);

router.route('/:id')
    .get(getBanquetById as any)
    .patch(protect as any, admin as any, uploadBanquete.array('images', 10), updateBanquete as any)
    .delete(protect as any, admin as any, deleteBanquet as any);

router.patch('/:id/toggle', protect as any, admin as any, toggleBanquet as any);

export default router;