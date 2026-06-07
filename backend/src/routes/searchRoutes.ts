import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { globalSearch } from '../controllers/searchController';

const router = express.Router();

router.get('/', protect as any, admin as any, globalSearch as any);

export default router;
