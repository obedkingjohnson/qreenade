import { getProduct, products, type Product } from "@/lib/catalog";
import {
  TRYON_GENERATION_MODE,
  TRYON_MODEL_NAME,
  TRYON_NUM_IMAGES,
  TRYON_OUTPUT_FORMAT,
  TRYON_POLL_INTERVAL_MS,
  TRYON_POLL_TIMEOUT_MS,
  TRYON_RESOLUTION,
  TRYON_RETURN_BASE64,
} from "@/lib/tryon-config";
import { validateModelImage } from "@/lib/tryon-image";

/**
 * Server-only try-on provider boundary.
 * Do not import this module from a Client Component.
 * FASHN_API_KEY is read from process.env inside createTryOnProvider and is
 * never returned, logged, or sent to the browser.
 */

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const CATALOG_HOSTS = new Set(["d2j6dbq0eux0bg.cloudfront.net", "d2gt4h1eeousrn.cloudfront.net"]);
const OUTPUT_HOSTS = new Set(["cdn.fashn.ai", "media.fashn.ai"]);
const PREDICTION_ID = /^[A-Za-z0-9_-]{8,128}$/;
const MAX_OUTPUT_CHARS = 20_000_000;
const MAX_OUTPUT_BYTES = 15 * 1024 * 1024;

export type TryOnInput = {
  productImage: string;
  modelImage: string;
};

export type TryOnResult = {
  images: string[];
};

export interface TryOnProvider {
  readonly name: string;
  generate(input: TryOnInput, signal?: AbortSignal): Promise<TryOnResult>;
}

export class TryOnNotConfiguredError extends Error {
  constructor() {
    super("try-on not configured");
    this.name = "TryOnNotConfiguredError";
  }
}

export class TryOnRequestError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "TryOnRequestError";
    this.status = status;
  }
}

export type TryOnFailureCode = "timeout" | "unavailable" | "busy" | "rejected" | "empty";

export class TryOnProviderError extends Error {
  readonly code: TryOnFailureCode;

  constructor(message: string, code: TryOnFailureCode) {
    super(message);
    this.name = "TryOnProviderError";
    this.code = code;
  }
}

type Resolution = "1k" | "2k" | "4k";
type GenerationMode = "fast" | "balanced" | "quality";
type OutputFormat = "jpeg" | "png";

type FashnRunBody = {
  model_name: typeof TRYON_MODEL_NAME;
  inputs: {
    product_image: string;
    model_image: string;
    resolution: Resolution;
    generation_mode: GenerationMode;
    num_images: number;
    output_format: OutputFormat;
    return_base64: true;
  };
};

type FashnError = {
  name?: string;
  message?: string;
};

type FashnPayload = {
  id?: string | null;
  status?: string;
  output?: unknown;
  error?: string | FashnError | null;
  message?: string;
};

export function createTryOnProvider(fetchImpl: typeof fetch = fetch): TryOnProvider {
  const apiKey = process.env.FASHN_API_KEY?.trim() ?? "";
  if (!apiKey) throw new TryOnNotConfiguredError();
  return new FashnTryOnProvider(apiKey, fetchImpl);
}

export function resolveProductImage(input: { slug?: string; productImage?: string }): string {
  const slug = input.slug?.trim();
  const productImage = input.productImage?.trim();

  if (slug) {
    const product = getProduct(slug);
    if (!product) throw new TryOnRequestError("Unknown product.");
    if (productImage) {
      if (!catalogImages(product).includes(productImage)) {
        throw new TryOnRequestError("That product image is not in the catalog.");
      }
      return assertCatalogUrl(productImage);
    }
    return assertCatalogUrl(product.image);
  }

  if (productImage) {
    const known = products.some((product) => catalogImages(product).includes(productImage));
    if (!known) throw new TryOnRequestError("That product image is not in the catalog.");
    return assertCatalogUrl(productImage);
  }

  throw new TryOnRequestError("Choose a product to try on.");
}

export function prepareModelImage(dataUri: string): string {
  try {
    return validateModelImage(dataUri);
  } catch (error) {
    const message = error instanceof Error ? error.message : "That photo could not be read.";
    const status = message === "That photo is too large." ? 413 : 400;
    throw new TryOnRequestError(message, status);
  }
}

export function buildFashnRunBody(input: TryOnInput): FashnRunBody {
  if (TRYON_NUM_IMAGES < 1 || TRYON_NUM_IMAGES > 4) {
    throw new TryOnProviderError("Try-on is unavailable right now.", "unavailable");
  }

  return {
    model_name: TRYON_MODEL_NAME,
    inputs: {
      product_image: input.productImage,
      model_image: input.modelImage,
      resolution: TRYON_RESOLUTION,
      generation_mode: TRYON_GENERATION_MODE,
      num_images: TRYON_NUM_IMAGES,
      output_format: TRYON_OUTPUT_FORMAT,
      return_base64: TRYON_RETURN_BASE64,
    },
  };
}

class FashnTryOnProvider implements TryOnProvider {
  readonly name = "fashn";

  constructor(
    private readonly apiKey: string,
    private readonly fetchImpl: typeof fetch,
  ) {}

  async generate(input: TryOnInput, signal?: AbortSignal): Promise<TryOnResult> {
    const deadline = Date.now() + TRYON_POLL_TIMEOUT_MS;
    const id = await this.submit(input, signal);
    const pending = new Set(["starting", "in_queue", "processing"]);

    while (Date.now() < deadline) {
      const wait = Math.min(TRYON_POLL_INTERVAL_MS, deadline - Date.now());
      if (wait > 0) await delay(wait, signal);
      if (Date.now() >= deadline) break;

      let status: FashnPayload;
      try {
        status = await this.poll(id, signal);
      } catch (error) {
        if (error instanceof TryOnProviderError && error.code === "timeout" && Date.now() < deadline) {
          continue;
        }
        throw error;
      }
      if (status.status === "completed") {
        const images = await this.inlineOutputs(status.output, signal);
        if (images.length === 0) {
          throw new TryOnProviderError("Try-on did not return an image.", "empty");
        }
        return { images };
      }

      if (status.status === "failed" || (status.error && !pending.has(status.status ?? ""))) {
        throw new TryOnProviderError(providerMessage(status, this.apiKey, "rejected"), "rejected");
      }
    }

    throw new TryOnProviderError("Try-on timed out. Please try again.", "timeout");
  }

  private async submit(input: TryOnInput, signal?: AbortSignal): Promise<string> {
    let response: Response;
    try {
      response = await this.fetchImpl(FASHN_RUN_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildFashnRunBody(input)),
        cache: "no-store",
        signal: linkSignal(signal, 20_000),
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new TryOnProviderError("Try-on could not be reached. Please try again.", "unavailable");
    }

    const payload = await readPayload(response);
    if (!response.ok || !payload?.id || payload.error) {
      throw httpFailure(response.status, payload, this.apiKey);
    }
    if (!PREDICTION_ID.test(payload.id)) {
      throw new TryOnProviderError("Try-on could not be started.", "unavailable");
    }
    return payload.id;
  }

  private async poll(id: string, signal?: AbortSignal): Promise<FashnPayload> {
    let response: Response;
    try {
      response = await this.fetchImpl(`${FASHN_STATUS_URL}/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${this.apiKey}` },
        cache: "no-store",
        signal: linkSignal(signal, 15_000),
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      if (isAbort(error)) {
        throw new TryOnProviderError("Try-on timed out. Please try again.", "timeout");
      }
      throw new TryOnProviderError("Try-on could not be reached. Please try again.", "unavailable");
    }

    const payload = await readPayload(response);
    if (!response.ok && response.status !== 200) {
      if (response.status >= 500 || !payload) {
        throw new TryOnProviderError("Try-on could not be reached. Please try again.", "unavailable");
      }
      throw httpFailure(response.status, payload, this.apiKey);
    }
    return payload ?? {};
  }

  private async inlineOutputs(output: unknown, signal?: AbortSignal): Promise<string[]> {
    if (!Array.isArray(output)) return [];
    const images: string[] = [];
    for (const item of output) {
      if (typeof item !== "string" || !item) continue;
      images.push(await inlineOutput(item, this.fetchImpl, signal));
    }
    return images;
  }
}

function catalogImages(product: Product): string[] {
  return [product.image, ...(product.gallery ?? [])];
}

function assertCatalogUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TryOnRequestError("Product image must be a catalog URL.");
  }
  if (url.protocol !== "https:" || !CATALOG_HOSTS.has(url.hostname)) {
    throw new TryOnRequestError("Product image must be a catalog URL.");
  }
  return value;
}

async function inlineOutput(
  value: string,
  fetchImpl: typeof fetch,
  signal?: AbortSignal,
): Promise<string> {
  if (value.startsWith("data:image/")) {
    if (!isInlineImage(value)) {
      throw new TryOnProviderError("Try-on did not return an image.", "empty");
    }
    return value;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TryOnProviderError("Try-on did not return an image.", "empty");
  }
  if (url.protocol !== "https:" || !OUTPUT_HOSTS.has(url.hostname)) {
    throw new TryOnProviderError("Try-on did not return an image.", "empty");
  }

  let response: Response;
  try {
    response = await fetchImpl(url, {
      signal: linkSignal(signal, 15_000),
      redirect: "error",
      cache: "no-store",
    });
  } catch (error) {
    throw networkError(error);
  }
  if (!response.ok) {
    throw new TryOnProviderError("Try-on did not return an image.", "empty");
  }

  const type = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  if (type !== "image/jpeg" && type !== "image/png" && type !== "image/webp") {
    throw new TryOnProviderError("Try-on did not return an image.", "empty");
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_OUTPUT_BYTES) {
    throw new TryOnProviderError("Try-on result was too large.", "empty");
  }
  return `data:${type};base64,${bytes.toString("base64")}`;
}

function isInlineImage(value: string): boolean {
  if (value.length > MAX_OUTPUT_CHARS) return false;
  const header = /^data:image\/(jpeg|jpg|png|webp);base64,/.exec(value.slice(0, 40));
  if (!header) return false;
  const data = value.slice(header[0].length);
  return data.length > 32 && data.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(data);
}

async function readPayload(response: Response): Promise<FashnPayload | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as FashnPayload;
  } catch {
    return null;
  }
}

function httpFailure(status: number, payload: FashnPayload | null, apiKey: string): TryOnProviderError {
  if (status === 401 || status === 403) {
    return new TryOnProviderError("Try-on is unavailable right now.", "unavailable");
  }
  if (status === 429) {
    return new TryOnProviderError("Try-on is busy. Please try again in a moment.", "busy");
  }
  if (status === 400 || status === 422) {
    return new TryOnProviderError(
      providerMessage(payload, apiKey, "rejected"),
      "rejected",
    );
  }
  return new TryOnProviderError(
    providerMessage(payload, apiKey, "unavailable"),
    "unavailable",
  );
}

function providerMessage(
  payload: FashnPayload | null,
  apiKey: string,
  kind: "rejected" | "unavailable",
): string {
  const fallback =
    kind === "rejected"
      ? "That photo or product image could not be used."
      : "Try-on could not be completed. Please try again.";
  return sanitizeMessage(messageFrom(payload) || fallback, apiKey);
}

function messageFrom(payload: FashnPayload | null): string {
  if (!payload) return "";
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message.trim();
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error.trim();
  if (payload.error && typeof payload.error === "object") {
    if (typeof payload.error.message === "string" && payload.error.message.trim()) {
      return payload.error.message.trim();
    }
    if (typeof payload.error.name === "string" && payload.error.name.trim()) {
      return payload.error.name.trim();
    }
  }
  return "";
}

function sanitizeMessage(message: string, apiKey: string): string {
  const redacted = apiKey ? message.split(apiKey).join("redacted") : message;
  return redacted.replace(/bearer\s+\S+/gi, "bearer redacted").slice(0, 240);
}

function networkError(error: unknown): TryOnProviderError {
  if (error instanceof TryOnProviderError) return error;
  if (isAbort(error)) {
    return new TryOnProviderError("Try-on timed out. Please try again.", "timeout");
  }
  return new TryOnProviderError("Try-on could not be reached. Please try again.", "unavailable");
}

function isAbort(error: unknown): boolean {
  return (
    (error instanceof DOMException && (error.name === "AbortError" || error.name === "TimeoutError")) ||
    (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError"))
  );
}

function linkSignal(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  return AbortSignal.any([signal, timeout]);
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(abortError());
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function abortError() {
  return new DOMException("The try-on request was cancelled.", "AbortError");
}
