import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'OPENAI_API_KEY'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARN] Missing environment variable: ${key}`);
  }
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};
