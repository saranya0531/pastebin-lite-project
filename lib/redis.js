import { createClient } from "redis";

let redis;

if (!global._redisClient) {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  global._redisClient = redis;
} else {
  redis = global._redisClient;
}

export async function getRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}