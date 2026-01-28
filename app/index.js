import redis from "../../../lib/redis";

export default async function handler(req, res) {
  try {
    await redis.set("myKey", "Hello Redis");
    const value = await redis.get("myKey");

    res.status(200).json({ value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}