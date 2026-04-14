import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import profileRoutes from './routes/profile.routes.js';
import { rateLimit } from './middlewares/rate-limit.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI DSA Copilot API'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', rateLimit({ windowMs: 60_000, maxRequests: 40, keyPrefix: 'auth' }), authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submit', rateLimit({ windowMs: 60_000, maxRequests: 100, keyPrefix: 'submit' }), submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
