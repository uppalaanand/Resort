
import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect as any, admin as any, getAllUsers as any);

router.route('/me')
    .get(protect as any, getUserProfile as any)
    .patch(protect as any, updateUserProfile as any);

export default router;
