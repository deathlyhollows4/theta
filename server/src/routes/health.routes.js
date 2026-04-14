import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI DSA Copilot API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
