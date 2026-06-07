import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getAllUsers, getUserById, getUserProfile, updateUserProfile, createStaffUser, toggleUserActive, updateUserById } from '../controllers/userController';

const router = express.Router();

router.route('/')
    .get(protect as any, admin as any, getAllUsers as any);

router.route('/my')
    .get(protect as any, getUserProfile as any)
    .patch(protect as any, updateUserProfile as any);

router.post('/staff', protect as any, admin as any, createStaffUser as any);

router.route('/:id')
    .get(protect as any, admin as any, getUserById as any)
    .patch(protect as any, admin as any, updateUserById as any);

router.patch('/:id/toggle', protect as any, admin as any, toggleUserActive as any);

export default router;