"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "error" | "ready";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }
    const subject = encodeURIComponent(`Qreenade enquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      `${message.trim()}\n\n${name.trim()}\n${email.trim()}`,
    );
    window.location.href = `mailto:qreenadebyamuta@gmail.com?subject=${subject}&body=${body}`;
    setStatus("ready");
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-xl space-y-5" noValidate>
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
        <p className="text-sm text-mute">
          This opens your email app, addressed to Qreenade.
        </p>
      </div>
      {status === "error" && (
        <p className="text-sm text-ink" role="alert">
          Add your name, email, and a message before sending.
        </p>
      )}
      {status === "ready" && (
        <p className="text-sm text-mute" role="status">
          Your email app should open with this message.
        </p>
      )}
      <button
        type="submit"
        className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper active:scale-[0.98]"
      >
        Email us
      </button>
    </form>
  );
}
