import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getAllUsers, getUserById, getUserProfile, updateUserProfile } from '../controllers/userController';

const router = express.Router();

router.route('/')
    .get(protect as any, admin as any, getAllUsers as any);

router.route('/my')
    .get(protect as any, getUserProfile as any)
    .patch(protect as any, updateUserProfile as any);

router.route('/:id').get(protect as any, admin as any, getUserById as any);

export default router;