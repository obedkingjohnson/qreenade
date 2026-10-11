/**
 * FASHN Try-On Max defaults. Change these constants to retune every try-on.
 * Credit cost is per output image and is multiplied by TRYON_NUM_IMAGES.
 * At resolution 2k and generation_mode balanced, FASHN charges 3 credits.
 * https://docs.fashn.ai/api-reference/tryon-max
 */
export const TRYON_MODEL_NAME = "tryon-max" as const;
export const TRYON_RESOLUTION = "2k" as const;
export const TRYON_GENERATION_MODE = "balanced" as const;
export const TRYON_NUM_IMAGES = 1;
export const TRYON_OUTPUT_FORMAT = "jpeg" as const;
export const TRYON_RETURN_BASE64 = true;

/** Credits per successful image at the defaults above (2k, balanced). */
export const TRYON_CREDITS_PER_IMAGE = 3;

/** Poll spacing. FASHN asks for about 2 to 3 seconds between status checks. */
export const TRYON_POLL_INTERVAL_MS = 2500;

/**
 * Stop polling and return a timeout. Balanced at 2k is about 25 seconds.
 * The slowest published combination is about 55 seconds.
 * Keep this under the route maxDuration so the handler can answer first.
 */
export const TRYON_POLL_TIMEOUT_MS = 52000;

/**
 * SOFT SPEND CAP
 * Maximum try-on jobs this server process will start during the window below.
 * In-memory only: it resets on restart and is not shared across instances.
 * Treat it as a safety brake, not a billing guarantee.
 * Lower TRYON_SOFT_CAP to reduce FASHN credit spend.
 * Each started job is billed by FASHN only if it succeeds, at
 * TRYON_CREDITS_PER_IMAGE times TRYON_NUM_IMAGES.
 */
export const TRYON_SOFT_CAP = 40;
export const TRYON_SOFT_CAP_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Per IP, per server process. Stops a single client from looping the endpoint. */
export const TRYON_RATE_LIMIT_MAX = 4;
export const TRYON_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Decoded shopper photo cap. The JSON body cap stays under typical
 * serverless request limits (about 4.5 MB) after base64 expansion.
 */
export const TRYON_MAX_PHOTO_BYTES = 3 * 1024 * 1024;
export const TRYON_MAX_BODY_BYTES = 4 * 1024 * 1024;

/** FASHN rejects inputs outside these bounds with InputValidationError. */
export const TRYON_MIN_EDGE_PX = 15;
export const TRYON_MIN_ASPECT = 1 / 16;
export const TRYON_MAX_ASPECT = 16;
