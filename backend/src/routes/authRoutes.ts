import express from 'express';
import { registerUser, loginUser, googleLogin, googleCompleteProfile, forgotPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/google-login', googleLogin as any);
router.post('/google-complete-profile', googleCompleteProfile as any);
router.post('/forgot-password', forgotPassword as any);

export default router;