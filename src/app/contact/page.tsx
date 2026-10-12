import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Write to the Qreenade studio in Lagos about orders, sizing, and making.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl tracking-tight md:text-5xl">Contact</h1>
      <p className="mt-4 max-w-[42ch] leading-relaxed text-mute">
        Orders, sizing, and studio questions go to the same inbox.
      </p>
      <p className="mt-6 text-sm">
        <a
          className="underline underline-offset-4"
          href="mailto:qreenadebyamuta@gmail.com"
        >
          qreenadebyamuta@gmail.com
        </a>
      </p>
      <p className="mt-2 text-sm text-mute">Lagos, Nigeria</p>
      <ContactForm />
    </div>
  );
}
