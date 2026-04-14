import { Router } from 'express';
import { body, query } from 'express-validator';
import { getSubmissionHistory, runCode, runCustomCode, submitCode } from '../controllers/submission.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';

const router = Router();

const submissionValidation = [
  body('problemSlug').trim().notEmpty().withMessage('problemSlug is required.'),
  body('code').trim().isLength({ min: 10 }).withMessage('Code must be at least 10 characters long.'),
  body('language').optional().isIn(['javascript']).withMessage('Unsupported language.')
];

const runCustomValidation = [
  body('code').trim().isLength({ min: 10 }).withMessage('Code must be at least 10 characters long.'),
  body('customInput').trim().notEmpty().withMessage('customInput is required and must be JSON array format.'),
  body('language').optional().isIn(['javascript']).withMessage('Unsupported language.')
];

const historyValidation = [query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50.')];

router.post('/run', protect, submissionValidation, validateRequest, runCode);
router.post('/run-custom', protect, runCustomValidation, validateRequest, runCustomCode);
router.post('/', protect, submissionValidation, validateRequest, submitCode);
router.get('/history', protect, historyValidation, validateRequest, getSubmissionHistory);

export default router;
