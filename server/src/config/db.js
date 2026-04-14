import mongoose from 'mongoose';
import { env } from './env.js';

let dbConnected = false;

export const isDbConnected = () => dbConnected;

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    if (env.REQUIRE_DB) {
      throw new Error('MONGODB_URI is required when REQUIRE_DB=true.');
    }

    console.warn('[DB] MONGODB_URI is not set. Starting in degraded mode without database.');
    dbConnected = false;
    return false;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'ai_dsa_copilot'
    });

    console.info('[DB] MongoDB connected successfully');
    dbConnected = true;
    return true;
  } catch (error) {
    const hint =
      'MongoDB connection failed. In Codespaces, use a cloud MongoDB URI (Atlas) in server/.env instead of localhost unless MongoDB is running in the container.';
    dbConnected = false;

    if (env.REQUIRE_DB) {
      throw new Error(`${error.message}. ${hint}`);
    }

    console.warn(`[DB] ${error.message}. ${hint}`);
    console.warn('[DB] Continuing startup in degraded mode because REQUIRE_DB=false.');
    return false;
  }
};
