import redis from "redis";
import envCaptured from "./envValidation.js";

export const client = redis.createClient({
  url: `redis://${envCaptured.redis.url}:${envCaptured.redis.port}`,
});
client.on("error", function (error) {
  console.error("Redis not connected successfully", error);
});
client.on("connect", function (error) {
  console.log("Redis Cache Management connected successfully");
});
await client.connect();

export const setCacheWithTTL = async (
  key,
  value,
  ttl = envCaptured.redis.ttl
) => {
  try {
    await client.set(key, value, { EX: ttl });
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

export const getCache = async (key) => {
  try {
    const value = await client.get(key);
    return value;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
};
