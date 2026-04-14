import { Router } from 'express';
import { getRoadmap } from '../controllers/roadmap.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, getRoadmap);

export default router;
