import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to start the server.');
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'ai_dsa_copilot'
    });

    console.info('[DB] MongoDB connected successfully');
  } catch (error) {
    const hint =
      'MongoDB connection failed. In Codespaces, use a cloud MongoDB URI (Atlas) in server/.env instead of localhost unless MongoDB is running in the container.';
    throw new Error(`${error.message}. ${hint}`);
  }
};
