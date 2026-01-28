import { getRedis } from "../../../lib/redis";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const redis = await getRedis();
    const key = `paste:${id}`;

    const raw = await redis.get(key);
    if (!raw) {
      return res.status(404).json({ error: "Not found" });
    }

    const data = JSON.parse(raw);

    // ⏱ Deterministic time support
    const now =
      process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]
        ? Number(req.headers["x-test-now-ms"])
        : Date.now();

    if (data.expires_at && now > data.expires_at) {
      await redis.del(key);
      return res.status(404).json({ error: "Expired" });
    }

    if (data.remaining_views !== null) {
      if (data.remaining_views <= 0) {
        await redis.del(key);
        return res.status(404).json({ error: "View limit exceeded" });
      }
      data.remaining_views -= 1;
    }

    await redis.set(key, JSON.stringify(data));

    return res.status(200).json({
      content: data.content,
      remaining_views: data.remaining_views,
      expires_at: data.expires_at,
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch paste" });
  }
}