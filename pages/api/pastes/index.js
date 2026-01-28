import { nanoid } from "nanoid";
import { getRedis } from "../../../lib/redis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  // ✅ Validation (IMPORTANT)
  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "content is required" });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return res.status(400).json({ error: "ttl_seconds must be >= 1" });
  }

  if (max_views !== undefined && max_views < 1) {
    return res.status(400).json({ error: "max_views must be >= 1" });
  }

  try {
    const redis = await getRedis();
    const id = nanoid(8);

    const now = Date.now();
    const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

    const data = {
      content,
      remaining_views: max_views ?? null,
      expires_at,
    };

    const key = `paste:${id}`;

    if (ttl_seconds) {
      await redis.set(key, JSON.stringify(data), {
        EX: ttl_seconds,
      });
    } else {
      await redis.set(key, JSON.stringify(data));
    }

    return res.status(201).json({ id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create paste" });
  }
}