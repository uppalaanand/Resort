import { env } from './config/env';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import app from './app';

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;