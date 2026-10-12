/** Inbox the contact form used to open with mailto. */
export const DEFAULT_CONTACT_TO = "qreenadebyamuta@gmail.com";

/**
 * Resend's shared test sender.
 * It only delivers to the Resend account email until a domain is verified.
 * Override with CONTACT_FROM_EMAIL once a sender domain is verified.
 */
export const DEFAULT_CONTACT_FROM = "Qreenade <onboarding@resend.dev>";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 80;
const MESSAGE_MAX = 4000;

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export function isEmailAddress(value: string) {
  return value.length <= 254 && EMAIL.test(value) && !/[\u0000-\u001F]/.test(value);
}

/** Returns the address inside `Name <email>` or a bare address. */
export function senderEmail(from: string) {
  const trimmed = from.trim();
  if (!trimmed || trimmed.length > 320 || /[\r\n]/.test(trimmed)) return null;
  const wrapped = trimmed.match(/^(.*)<([^<>]+)>$/);
  const email = (wrapped ? wrapped[2] : trimmed).trim();
  if (!isEmailAddress(email)) return null;
  if (wrapped && !wrapped[1].trim()) return null;
  return email;
}

export function contactHoneypotTripped(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  return value != null;
}

export function validateContactFields(input: {
  name: string;
  email: string;
  message: string;
}): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !email || !message) {
    return "Add your name, email, and a message before sending.";
  }
  if (name.length > NAME_MAX) return "Name is too long.";
  if (!isEmailAddress(email)) return "Enter a valid email address.";
  if (message.length > MESSAGE_MAX) return "Message is too long.";
  return null;
}
