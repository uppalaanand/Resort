import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { sendOTP, verifyOTP } from '../controllers/otpController';

const router = express.Router();

router.post('/send', protect as any, sendOTP as any);
router.post('/verify', protect as any, verifyOTP as any);

export default router;
