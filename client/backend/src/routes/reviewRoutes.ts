
import express from 'express';
import { createReview, getRoomReviews, getBanquetReviews } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect as any, createReview as any);
router.route('/room/:roomId').get(getRoomReviews as any);
router.route('/banquet/:banquetId').get(getBanquetReviews as any);

export default router;
