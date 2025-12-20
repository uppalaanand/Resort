
import express from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController';
const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/google', googleLogin as any);

export default router;
