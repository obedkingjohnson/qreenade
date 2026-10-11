import {
  TRYON_RATE_LIMIT_MAX,
  TRYON_RATE_LIMIT_WINDOW_MS,
  TRYON_SOFT_CAP,
  TRYON_SOFT_CAP_WINDOW_MS,
} from "@/lib/tryon-config";

type Bucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, Bucket>();
let spend: Bucket = { count: 0, resetAt: 0 };

export class TryOnLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = "TryOnLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function clientKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  return ip.slice(0, 80);
}

/** Counts a request against the per-IP limit. Does not touch the spend cap. */
export function takeRateLimitSlot(key: string, now = Date.now()) {
  prune(now);
  const bucket = rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + TRYON_RATE_LIMIT_WINDOW_MS });
    return;
  }
  if (bucket.count >= TRYON_RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    throw new TryOnLimitError(
      "Too many try-on requests. Please wait a few minutes.",
      retryAfterSeconds,
    );
  }
  bucket.count += 1;
}

/**
 * Counts one submission against the soft spend cap.
 * Call this only after the photo and product have been accepted,
 * immediately before the provider request.
 */
export function takeSpendSlot(now = Date.now()) {
  if (now >= spend.resetAt) {
    spend = { count: 1, resetAt: now + TRYON_SOFT_CAP_WINDOW_MS };
    return;
  }
  if (spend.count >= TRYON_SOFT_CAP) {
    const retryAfterSeconds = Math.max(1, Math.ceil((spend.resetAt - now) / 1000));
    throw new TryOnLimitError("Try-on is paused for now. Please try again later.", retryAfterSeconds);
  }
  spend.count += 1;
}

function prune(now: number) {
  if (rateBuckets.size < 200) return;
  for (const [key, bucket] of rateBuckets) {
    if (now >= bucket.resetAt) rateBuckets.delete(key);
  }
}
