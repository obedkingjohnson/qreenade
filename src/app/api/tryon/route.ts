import { connection } from "next/server";
import { TRYON_MAX_BODY_BYTES } from "@/lib/tryon-config";
import { clientKeyFromRequest, takeRateLimitSlot, takeSpendSlot, TryOnLimitError } from "@/lib/tryon-limit";
import {
  createTryOnProvider,
  prepareModelImage,
  resolveProductImage,
  TryOnNotConfiguredError,
  TryOnProviderError,
  TryOnRequestError,
} from "@/lib/tryon";

/**
 * Shopper photos and try-on results stay in memory for this request only.
 * Nothing is written to a database, a bucket, or a log.
 * FASHN_API_KEY is read on the server at request time and never reaches the client.
 */

export const maxDuration = 60;

type TryOnBody = {
  slug?: string;
  productImage?: string;
  modelImage?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  await connection();

  try {
    takeRateLimitSlot(clientKeyFromRequest(request));
    const body = await readBody(request);

    if (body.consent !== true) {
      throw new TryOnRequestError("Consent is required before a try-on can be generated.");
    }

    const productImage = resolveProductImage({
      slug: body.slug,
      productImage: body.productImage,
    });
    const modelImage = prepareModelImage(body.modelImage ?? "");
    const provider = createTryOnProvider();
    takeSpendSlot();

    const result = await provider.generate(
      { productImage, modelImage },
      request.signal,
    );

    return json({ images: result.images });
  } catch (error) {
    if (isAbort(error)) {
      return json({ error: "Try-on timed out. Please try again." }, 504);
    }
    if (error instanceof TryOnNotConfiguredError) {
      return json({ error: "try-on not configured" }, 503);
    }
    if (error instanceof TryOnRequestError) {
      return json({ error: error.message }, error.status);
    }
    if (error instanceof TryOnLimitError) {
      return json({ error: error.message }, 429, {
        "Retry-After": String(error.retryAfterSeconds),
      });
    }
    if (error instanceof TryOnProviderError) {
      const status =
        error.code === "timeout" ? 504 : error.code === "rejected" ? 400 : error.code === "busy" ? 429 : 502;
      return json({ error: error.message }, status);
    }
    return json({ error: "Try-on could not be completed. Please try again." }, 500);
  }
}

async function readBody(request: Request): Promise<TryOnBody> {
  const text = await readLimitedText(request, TRYON_MAX_BODY_BYTES);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new TryOnRequestError("Could not read that request.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new TryOnRequestError("Could not read that request.");
  }

  const record = parsed as Record<string, unknown>;
  return {
    slug: typeof record.slug === "string" ? record.slug : undefined,
    productImage: typeof record.productImage === "string" ? record.productImage : undefined,
    modelImage: typeof record.modelImage === "string" ? record.modelImage : undefined,
    consent: record.consent === true,
  };
}

async function readLimitedText(request: Request, maxBytes: number): Promise<string> {
  const declared = request.headers.get("content-length");
  if (declared) {
    const size = Number(declared);
    if (!Number.isFinite(size) || size < 0) {
      throw new TryOnRequestError("Could not read that request.");
    }
    if (size > maxBytes) {
      throw new TryOnRequestError("That photo is too large.", 413);
    }
  }

  if (!request.body) {
    throw new TryOnRequestError("Choose a photo to try on.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    let done = false;
    let value: Uint8Array | undefined;
    try {
      const next = await reader.read();
      done = next.done;
      value = next.value;
    } catch {
      throw new TryOnRequestError("Could not read that request.");
    }
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new TryOnRequestError("That photo is too large.", 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function json(body: { images?: string[]; error?: string }, status = 200, extra?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...Object.fromEntries(new Headers(extra).entries()),
    },
  });
}

function isAbort(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}
