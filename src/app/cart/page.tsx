import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Bag",
  description: "Review pieces in your Qreenade bag.",
  path: "/cart",
  noindex: true,
});

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl tracking-tight md:text-5xl">Bag</h1>
      <CartView />
    </div>
  );
}
