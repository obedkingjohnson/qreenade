import { connection } from "next/server";
import { DEFAULT_CONTACT_FROM, DEFAULT_CONTACT_TO, contactHoneypotTripped, contactSentTooFast, validateContactFields } from "@/lib/contact";
import { ContactConfigError, ContactDeliveryError, sendContactEmail } from "@/lib/contact-mail";
import { clientKeyFromRequest, ContactLimitError, takeContactRateLimit } from "@/lib/contact-limit";

/**
 * Visitor messages are emailed through Resend at request time.
 * RESEND_API_KEY is read here and never sent to the browser.
 * A missing key returns an error. It does not throw while the app is building.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;

class ContactBodyError extends Error {
  constructor() {
    super("Could not read that request.");
    this.name = "ContactBodyError";
  }
}

export async function POST(request: Request) {
  await connection();

  try {
    const body = await readJson(request);
    if (contactHoneypotTripped(field(body, "website"))) {
      return json({ ok: true });
    }

    if (contactSentTooFast(field(body, "startedAt"))) {
      return json({ error: "That was quick. Please wait a moment and send again." }, 400);
    }

    await takeContactRateLimit(clientKeyFromRequest(request));

    const name = stringField(body, "name");
    const email = stringField(body, "email");
    const message = stringField(body, "message");
    const validationError = validateContactFields({ name, email, message });
    if (validationError) {
      return json({ error: validationError }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO;
    const from = process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_CONTACT_FROM;

    await sendContactEmail(
      { name: name.trim(), email: email.trim(), message: message.trim() },
      { apiKey, to, from },
    );
    return json({ ok: true });
  } catch (error) {
    if (error instanceof ContactLimitError) {
      return json({ error: error.message }, 429, {
        "Retry-After": String(error.retryAfterSeconds),
      });
    }
    if (error instanceof ContactConfigError) {
      return json({ error: error.message }, 503);
    }
    if (error instanceof ContactDeliveryError) {
      return json({ error: error.message }, 502);
    }
    if (error instanceof ContactBodyError) {
      return json({ error: error.message }, 400);
    }
    console.error("Contact form failed.");
    return json({ error: "We could not send your message. Please try again." }, 500);
  }
}

async function readJson(request: Request): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared) {
    const size = Number(declared);
    if (!Number.isFinite(size) || size < 0 || size > MAX_BODY_BYTES) {
      throw new ContactBodyError();
    }
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    throw new ContactBodyError();
  }
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) {
    throw new ContactBodyError();
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ContactBodyError();
  }
}

function field(body: unknown, key: string): unknown {
  if (!body || typeof body !== "object") return undefined;
  return (body as Record<string, unknown>)[key];
}

function stringField(body: unknown, key: string) {
  const value = field(body, key);
  return typeof value === "string" ? value : "";
}

function json(body: { ok?: boolean; error?: string }, status = 200, extra?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...Object.fromEntries(new Headers(extra).entries()),
    },
  });
}
