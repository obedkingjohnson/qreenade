/**
 * Per IP limit of 5 messages every 15 minutes.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set,
 * so the limit holds across restarts and instances.
 * Otherwise falls back to an in-memory limit per server process.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export class ContactLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many messages. Please wait a few minutes and try again.");
    this.name = "ContactLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function clientKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  return ip.slice(0, 80);
}

export async function takeContactRateLimit(key: string, now = Date.now()) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (url && token) {
    const persisted = await takeRedisLimit(url, token, key);
    if (persisted) return;
  }
  takeMemoryLimit(key, now);
}

/** Returns true when Redis handled the check, false if Redis was unreachable. */
async function takeRedisLimit(url: string, token: string, key: string): Promise<boolean> {
  const redisKey = `contact-limit:${key}`;
  let count: number;
  let ttl: number;
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(WINDOW_MS / 1000), "NX"],
        ["TTL", redisKey],
      ]),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    count = Number(results[0]?.result);
    ttl = Number(results[2]?.result);
    if (!Number.isFinite(count)) return false;
  } catch {
    return false;
  }
  if (count > MAX_PER_WINDOW) {
    throw new ContactLimitError(Math.max(1, Number.isFinite(ttl) && ttl > 0 ? ttl : WINDOW_MS / 1000));
  }
  return true;
}

function takeMemoryLimit(key: string, now: number) {
  if (buckets.size >= 200) {
    for (const [bucketKey, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  if (bucket.count >= MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    throw new ContactLimitError(retryAfterSeconds);
  }
  bucket.count += 1;
}
