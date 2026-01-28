// pages/api/savePaste.js
import { getRedis } from "../../lib/redis";

export default async function handler(req, res) {
  try {
    const redis = await getRedis();

    if (req.method === "POST") {
      const { id, content } = req.body;
      if (!id || !content) return res.status(400).json({ error: "Missing fields" });

      await redis.set(id, content);
      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const keys = await redis.keys("*"); // get all paste IDs
      const pastes = [];
      for (let key of keys) {
        const value = await redis.get(key);
        pastes.push({ id: key, content: value });
      }
      return res.status(200).json({ pastes });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}