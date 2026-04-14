import { Router } from 'express';
import { getProblemBySlug, getProblems } from '../controllers/problem.controller.js';

const router = Router();

router.get('/', getProblems);
router.get('/:slug', getProblemBySlug);

export default router;
