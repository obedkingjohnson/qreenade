/**
 * Search indexing switch.
 * Indexing is off unless ALLOW_INDEXING is exactly "true".
 * Read on the server at build time, so a change needs a redeploy.
 */
export const INDEXING_ALLOWED = process.env.ALLOW_INDEXING?.trim() === "true";
