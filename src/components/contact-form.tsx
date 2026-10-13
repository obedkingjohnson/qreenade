"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { validateContactFields } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const validationError = validateContactFields({ name, email, message });
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website,
          startedAt: startedAt.current,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus("error");
        setError(readError(payload));
        return;
      }
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      startedAt.current = Date.now();
      setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not send your message. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-10 max-w-xl space-y-5" noValidate>
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-12 rounded-xl border border-line bg-surface px-3 text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-12 rounded-xl border border-line bg-surface px-3 text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="rounded-xl border border-line bg-surface px-3 py-3 text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-ink" role="alert">
          {error}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-mute" role="status">
          Thanks, we&apos;ll be in touch soon.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper active:scale-[0.98] disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

function readError(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const message = (payload as { error?: unknown }).error;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "We could not send your message. Please try again.";
}
