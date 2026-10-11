"use client";

import { Price } from "@/components/price";
import { UK_FREE_DELIVERY } from "@/lib/catalog";

export function DeliveryNote({
  subtotal,
  className,
}: {
  subtotal: number;
  className?: string;
}) {
  const included = subtotal >= UK_FREE_DELIVERY;

  return (
    <p className={className}>
      {included ? (
        "UK delivery is included. Express is charged separately. "
      ) : (
        <>
          UK delivery is included from <Price amount={UK_FREE_DELIVERY} />.
          Express is charged separately.{" "}
        </>
      )}
      Charged in naira.
    </p>
  );
}
