import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { campaign } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "The family studio behind Qreenade, making slow fashion in Lagos.",
  path: "/about",
  image: { url: campaign.story, alt: "Qreenade campaign photograph" },
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="max-w-[14ch] text-4xl tracking-tight md:text-6xl">
        A family studio in Lagos
      </h1>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="max-w-[48ch] space-y-4 text-base leading-relaxed text-mute">
          <p>
            qreenade is slow fashion by Amuta. Pieces are cut with time built
            in, then finished by artisans in the family studio.
          </p>
          <p>
            The work is dresses, skirts, tops, sets, and bags. Each one is made
            to order, so production can take up to 14 working days.
          </p>
          <p>
            When you buy a piece, you support that workshop and the pace it
            needs.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
          >
            Shop the collection
          </Link>
        </div>
        <Image
          src={campaign.story}
          alt="Qreenade campaign photograph"
          width={1400}
          height={1600}
          sizes="(min-width:1024px) 55vw, 100vw"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    </div>
  );
}
