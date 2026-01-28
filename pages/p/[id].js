import { getRedis } from "../../lib/redis";

export async function getServerSideProps({ params }) {
  const redis = await getRedis();
  const key = `paste:${params.id}`;

  const raw = await redis.get(key);
  if (!raw) {
    return { notFound: true };
  }

  const data = JSON.parse(raw);

  const now = Date.now();
  if (data.expires_at && now > data.expires_at) {
    await redis.del(key);
    return { notFound: true };
  }

  return {
    props: {
      content: data.content,
    },
  };
}

export default function PastePage({ content }) {
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        padding: "16px",
        fontFamily: "monospace",
      }}
    >
      {content}
    </pre>
  );
}