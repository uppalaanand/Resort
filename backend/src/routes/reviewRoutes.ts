import express from 'express';
import { admin, protect } from '../middleware/authMiddleware';
import { createReview, getRoomReviews, getBanquetReviews, deleteReview, getAllReviews } from '../controllers/reviewController';
// import upload from '../middleware/upload';

const router = express.Router();

router.route('/').post(protect as any, createReview as any);
router.route('/room/:roomId').get(protect as any, getRoomReviews as any);
router.route('/banquet/:banquetId').get(protect as any, getBanquetReviews as any);
router.route('/:reviewId').delete(protect as any, admin as any, deleteReview as any);
router.route('/').get(protect as any, admin as any, getAllReviews as any);

export default router;