import { getRedis } from "../../../lib/redis";

export default async function handler(req, res) {
  try {
    const redis = await getRedis();

    await redis.set("myKey", "Hello Redis");
    const value = await redis.get("myKey");

    res.status(200).json({ value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Redis failed" });
  }
}