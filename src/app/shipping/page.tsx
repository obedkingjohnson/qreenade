import type { Metadata } from "next";
import { Price } from "@/components/price";
import { UK_FREE_DELIVERY } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Shipping",
  description: "Delivery and production times for Qreenade orders, made in Lagos.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl tracking-tight md:text-5xl">Shipping</h1>
      <div className="mt-12 grid max-w-3xl gap-12">
        <section>
          <h2 className="text-xl tracking-tight">Delivery</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            UK orders from <Price amount={UK_FREE_DELIVERY} /> include delivery.
            Express shipping is charged separately. Orders are charged in naira.
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight">Production</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            Pieces are made to order. Allow up to 14 working days before your
            parcel leaves Lagos.
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight">Where we are</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            Everything is finished in Lagos. Questions about a parcel go to
            qreenadebyamuta@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
