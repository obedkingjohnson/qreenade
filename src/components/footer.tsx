import Link from "next/link";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <BrandMark className="h-10 w-[14.5rem]" />
          <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-mute">
            Handmade slow fashion from Lagos.
          </p>
        </div>
        <div>
          <p className="text-sm">Visit</p>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li>
              <Link href="/shop" className="hover:text-ink">
                Store
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li>
              <Link href="/shipping" className="hover:text-ink">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-ink">
                Bag
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm">Contact</p>
          <p className="mt-3 text-sm text-mute">Lagos, Nigeria</p>
          <a
            href="mailto:qreenadebyamuta@gmail.com"
            className="mt-2 block text-sm text-mute hover:text-ink"
          >
            qreenadebyamuta@gmail.com
          </a>
          <a
            href="https://www.instagram.com/qreenade"
            className="mt-3 inline-flex items-center gap-2 text-sm text-mute hover:text-ink"
          >
            <InstagramLogo size={16} />
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-xs text-mute md:px-6">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2">
          <p>qreenade TM</p>
          <p>Charged in naira.</p>
        </div>
      </div>
    </footer>
  );
}
