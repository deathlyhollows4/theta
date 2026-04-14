import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (payload) => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required to generate auth tokens.');
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
