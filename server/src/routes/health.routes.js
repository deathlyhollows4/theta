import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI DSA Copilot API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/ready', (_req, res) => {
  res.json({
    success: true,
    service: 'ai-dsa-copilot-api',
    uptimeSeconds: Math.floor(process.uptime()),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
