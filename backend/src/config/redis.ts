import { createClient } from 'redis';
import { env } from './env';

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (env.REDIS_URL) {
      await redisClient.connect();
      console.log('Redis connected successfully');
    } else {
      console.warn('Redis URL not configured, skipping Redis connection');
    }
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};

export default redisClient;