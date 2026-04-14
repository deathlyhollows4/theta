import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { meta } from '../config/meta.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI DSA Copilot API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/ready', (_req, res) => {
  const dbConnected = isDbConnected();

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    service: meta.service,
    database: {
      connected: dbConnected
    },
    uptimeSeconds: Math.floor(process.uptime()),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: meta.version
  });
});

export default router;
