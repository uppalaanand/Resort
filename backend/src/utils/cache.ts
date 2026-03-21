import redisClient from "../config/redis";


//  Get data from Redis cache
export const getCache = async (key: string) => {
  try {
    //get data from Redis
    const data = await redisClient.get(key);
    // If no data, return null
    if (!data) {
      return null;
    }
    // Parse and return cached data
    return JSON.parse(data);
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
};

/**
 * Set data in Redis cache
 * @param key cache key
 * @param value data to cache
 * @param ttl time to live in seconds (default: 1 hour)
 */
export const setCache = async ( key: string, value: any, ttl: number = 3600) => {
  try {
    // Set data in Redis with expiration
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Redis SET error:", error);
  }
};


//  Delete single cache key
export const deleteCache = async (key: string) => {
  try {
    // Delete key from Redis
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis DELETE error:", error);
  }
};


// Delete multiple cache keys
export const deleteMultipleCache = async (keys: string[]) => {
  try {
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Redis MULTI DELETE error:", error);
  }
};