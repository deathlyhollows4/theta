import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to start the server.');
  }

  await mongoose.connect(env.MONGODB_URI, {
    dbName: 'ai_dsa_copilot'
  });

  console.info('[DB] MongoDB connected successfully');
};
