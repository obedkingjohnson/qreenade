import Image from "next/image";
import { cn } from "@/lib/cn";

export function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("relative block h-8 w-[11.5rem]", className)}>
      <Image
        src="/brand/logo-black.png"
        alt="qreenade by Amuta"
        fill
        priority={priority}
        sizes="184px"
        className="logo-on-light object-contain object-left"
      />
      <Image
        src="/brand/logo-white.png"
        alt=""
        fill
        sizes="184px"
        className="logo-on-dark object-contain object-left"
      />
    </span>
  );
}
