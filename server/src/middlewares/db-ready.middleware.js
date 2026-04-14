import { isDbConnected } from '../config/db.js';

export const requireDbConnection = (_req, res, next) => {
  if (isDbConnected()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message:
      'Database is unavailable. Set MONGODB_URI in server/.env (or start MongoDB) and restart the server.'
  });
};
