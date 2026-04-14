import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    app.listen(env.PORT, () => {
      console.info(`[SERVER] Running on port ${env.PORT}`);
      if (!dbConnected) {
        console.warn(
          '[SERVER] Database-dependent routes return 503 until MongoDB is configured and the server is restarted.'
        );
      }
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
