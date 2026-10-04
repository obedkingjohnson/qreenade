import type { Metadata } from "next";
import { formatNaira } from "@/lib/format";
import { UK_FREE_DELIVERY } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Delivery and production times for qreenade orders.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl tracking-tight md:text-5xl">Shipping</h1>
      <div className="mt-12 grid max-w-3xl gap-12">
        <section>
          <h2 className="text-xl tracking-tight">Delivery</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            UK orders from {formatNaira(UK_FREE_DELIVERY)} include delivery.
            Express shipping is charged separately.
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight">Production</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            Pieces are made to order. Allow up to 14 working days before a
            parcel leaves the studio.
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight">Studio</h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-mute">
            Everything is finished in Lagos. Questions about a parcel go to
            qreenadebyamuta@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
