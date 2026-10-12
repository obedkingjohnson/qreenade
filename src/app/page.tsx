import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { CategoryRail } from "@/components/category-rail";
import { JsonLd } from "@/components/json-ld";
import { LogoParticles } from "@/components/logo-particles";
import { ProductReel } from "@/components/product-reel";
import { ScrollRevealImage } from "@/components/scroll-reveal-image";
import { Testimonials } from "@/components/testimonials";
import { campaign, products } from "@/lib/catalog";
import { homeJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <CategoryRail />
      <ProductReel products={products} />
      <LogoParticles />

      <section className="overflow-x-clip border-t border-line py-16 md:py-24">
        <ScrollRevealImage
          src={campaign.story}
          alt="Qreenade campaign photograph"
          height="78vh"
          fromWidth="42%"
          toWidth="100%"
          fromScale={1.45}
          toScale={1}
        />
        <div className="mx-auto max-w-[1400px] px-4 pt-10 md:px-6">
          <h2 className="max-w-[16ch] text-3xl tracking-tight md:text-5xl md:leading-[1.1]">
            Good things take time
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-mute">
            Every design is a wearable work of art, thoughtfully crafted and
            made for you. The family studio in Lagos guides the artisans who
            finish each piece.
          </p>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-mute">
            Choosing a piece supports that community, and the pace of slow
            fashion.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm active:scale-[0.98]"
          >
            Read our approach
          </Link>
        </div>
      </section>

      <Testimonials />

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl tracking-tight md:text-4xl">Lookbook</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {campaign.stills.map((still, index) => (
              <figure
                key={still.src}
                className={index === 0 ? "md:col-span-2" : undefined}
              >
                <div className="overflow-hidden bg-surface">
                  <Image
                    src={still.src}
                    alt={still.alt}
                    width={1400}
                    height={1200}
                    sizes="(min-width:768px) 50vw, 100vw"
                    priority={index === 0}
                    className={`w-full object-cover ${
                      index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
                    }`}
                  />
                </div>
                <figcaption className="mt-3 text-sm text-mute">
                  {still.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
