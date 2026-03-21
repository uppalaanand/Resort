### Implementing Caching Using Redis
    npm install redis --legacy-peer-deps

    docker run -d -p 6379:6379 --name ResortWork redis
    docker ps

    config/redis.ts
            import { createClient } from "redis";

            const redisClient = createClient({
            url: process.env.REDIS_URL || "redis://localhost:6379"
            });

            redisClient.on("error", (err) => {
            console.error("Redis Error:", err);
            });

            export const connectRedis = async () => {
            try {
                await redisClient.connect();
                console.log("Redis connected successfully");
            } catch (error) {
                console.error("Redis connection failed", error);
            }
            };

            export default redisClient;

    index.ts
        import { connectRedis } from "./config/redis";

        connectRedis();

### Keys Strategy
    rooms:all
    room:{id}

### Update Controller to Use Redis

    Now modify your roomController.ts
    Import redis:

    import redisClient from "../config/redis";