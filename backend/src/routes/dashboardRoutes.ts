import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/stats', protect as any, admin as any, getDashboardStats as any);

export default router;
