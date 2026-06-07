import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getActivityLogs, getEntityLogs } from '../controllers/activityLogController';

const router = express.Router();

router.get('/', protect as any, admin as any, getActivityLogs as any);
router.get('/entity/:type/:id', protect as any, admin as any, getEntityLogs as any);

export default router;
