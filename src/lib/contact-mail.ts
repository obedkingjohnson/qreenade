import { Resend } from "resend";
import { senderEmail, isEmailAddress, type ContactMessage } from "@/lib/contact";

export type ContactMailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

export class ContactConfigError extends Error {
  constructor() {
    super("Contact email is not configured.");
    this.name = "ContactConfigError";
  }
}

export class ContactDeliveryError extends Error {
  constructor() {
    super("We could not send your message. Please try again.");
    this.name = "ContactDeliveryError";
  }
}

/**
 * Sends one enquiry. Call only after request-time env values are read.
 * A missing API key is logged and returned as ContactConfigError.
 * This module does not read process.env at import time, so a build
 * without RESEND_API_KEY can still compile.
 */
export async function sendContactEmail(message: ContactMessage, config: ContactMailConfig) {
  if (!config.apiKey) {
    console.error("RESEND_API_KEY is missing. The contact form cannot send email.");
    throw new ContactConfigError();
  }
  if (!isEmailAddress(config.to)) {
    console.error("CONTACT_TO_EMAIL is not a valid email address.");
    throw new ContactConfigError();
  }
  if (!senderEmail(config.from)) {
    console.error("CONTACT_FROM_EMAIL is not a valid sender address.");
    throw new ContactConfigError();
  }

  const resend = new Resend(config.apiKey);
  const subjectName = message.name.replace(/[\r\n]+/g, " ");

  try {
    const { error } = await resend.emails.send({
      from: config.from,
      to: [config.to],
      replyTo: message.email,
      subject: `Qreenade enquiry from ${subjectName}`,
      text: `${message.message}\n\n${message.name}\n${message.email}`,
    });
    if (error) {
      console.error(`Resend rejected the contact message: ${error.name} ${error.message}`);
      throw new ContactDeliveryError();
    }
  } catch (error) {
    if (error instanceof ContactDeliveryError) throw error;
    const detail = error instanceof Error ? error.message : "unknown error";
    console.error(`Resend request failed: ${detail}`);
    throw new ContactDeliveryError();
  }
}
