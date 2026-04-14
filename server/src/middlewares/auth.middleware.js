import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('Authorization token missing or malformed.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  if (!env.JWT_SECRET) {
    const error = new Error('JWT secret is not configured.');
    error.statusCode = 500;
    throw error;
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    const error = new Error('User not found for provided token.');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});
