/**
 * Per IP, per server process.
 * In-memory only: it resets on restart and is not shared across instances.
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

export function takeContactRateLimit(key: string, now = Date.now()) {
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
