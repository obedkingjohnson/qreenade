"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  Handbag,
  List,
  MagnifyingGlass,
  Plus,
  X,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import { BagDrawer } from "@/components/bag-drawer";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { Price } from "@/components/price";
import { useCart } from "@/components/cart-provider";
import { categories, getProduct, heroSlides, searchProducts } from "@/lib/catalog";

const links = [
  { href: "/", label: "Home", shop: false },
  { href: "/about", label: "About", shop: false },
  { href: "/shop", label: "Store", shop: true },
  { href: "/shipping", label: "Shipping", shop: false },
  { href: "/contact", label: "Contact", shop: false },
];

const menuCategories = ["skirts", "dresses", "tops", "sets", "bags"]
  .map((slug) => categories.find((category) => category.slug === slug))
  .filter((category) => category !== undefined);

function CategoryRow({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate: (href: string) => void;
}) {
  const category = menuCategories.find((item) => item.slug === slug);
  if (!category) return null;
  const href = `/shop?category=${category.slug}`;
  return (
    <li>
      <Link
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(href);
        }}
        className="flex items-center gap-3 py-2"
      >
        <Image
          src={category.image}
          alt=""
          width={72}
          height={96}
          className="h-16 w-12 shrink-0 object-cover"
        />
        <span className="text-sm">{category.name}</span>
      </Link>
    </li>
  );
}

function StoreMenu({ onNavigate }: { onNavigate: (href: string) => void }) {
  const feature = heroSlides[0];
  const featured = getProduct(feature.slug);

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
      <ul className="flex flex-col">
        {menuCategories.map((category) => (
          <CategoryRow key={category.slug} slug={category.slug} onNavigate={onNavigate} />
        ))}
      </ul>
      <div className="relative min-h-[26rem] overflow-hidden bg-[#141414] lg:col-span-2">
        <Image
          src={feature.src}
          alt={feature.alt}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent px-5 pt-24 pb-5">
          <p className="text-3xl tracking-tight text-white">{feature.title}</p>
          {featured && (
            <p className="text-sm text-white/90">
              <Price amount={featured.price} />
            </p>
          )}
          <Link
            href={feature.href}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(feature.href);
            }}
            className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm text-[#141414] active:scale-[0.98]"
          >
            View product
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchProducts(query).slice(0, 6);

  useEffect(() => {
    const locked = menuOpen || bagOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, bagOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setBagOpen(false);
        setShopOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!shopOpen) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (headerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setShopOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [shopOpen]);

  function visit(href: string) {
    setShopOpen(false);
    setMenuOpen(false);
    router.push(href);
  }

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:px-6">
          <Link href="/" className="shrink-0" aria-label="qreenade by Amuta">
            <BrandMark priority />
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Primary">
            {links.map((link) =>
              link.shop ? (
                <span key={link.href} className="inline-flex items-center gap-1">
                  <Link href={link.href} className="text-sm text-ink/80 hover:text-ink">
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={shopOpen}
                    aria-label={shopOpen ? "Close the store menu" : "Open the store menu"}
                    onClick={() => setShopOpen((open) => !open)}
                    className="grid size-6 place-items-center text-ink"
                  >
                    <Plus size={14} className={`transition-transform ${shopOpen ? "rotate-45" : ""}`} />
                  </button>
                </span>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-ink/80 hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto hidden min-w-0 flex-1 justify-end lg:flex">
            <form
              className="relative w-full max-w-xs"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                if (results[0]) {
                  router.push(`/product/${results[0].slug}`);
                  setSearchOpen(false);
                  setQuery("");
                }
              }}
            >
              <label htmlFor={searchId} className="sr-only">
                Search the collection
              </label>
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mute"
                aria-hidden
              />
              <input
                id={searchId}
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search"
                className="h-10 w-full rounded-full border border-line bg-surface pr-4 pl-9 text-sm text-ink outline-none placeholder:text-mute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              {searchOpen && query.trim() && (
                <div className="absolute top-[calc(100%+8px)] right-0 z-40 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_40px_rgba(20,20,20,0.08)]">
                  {results.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-mute">
                      No pieces match that search.
                    </p>
                  ) : (
                    <ul>
                      {results.map((product) => (
                        <li key={product.slug}>
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-paper"
                            onClick={() => {
                              setSearchOpen(false);
                              setQuery("");
                            }}
                          >
                            <Image
                              src={product.image}
                              alt=""
                              width={40}
                              height={48}
                              className="h-12 w-10 object-cover"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm">
                                {product.name}
                              </span>
                              <span className="text-xs text-mute">
                                <Price amount={product.price} />
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:ml-3">
            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full hover:bg-surface lg:hidden"
              aria-label="Search the collection"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen((open) => !open);
              }}
            >
              <MagnifyingGlass size={20} />
            </button>
            <button
              type="button"
              className="relative grid size-10 place-items-center rounded-full hover:bg-surface"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={() => setBagOpen(true)}
            >
              <Handbag size={20} />
              {count > 0 && (
                <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] leading-4 text-paper">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full hover:bg-surface lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            role="search"
            className="border-t border-line px-4 py-3 lg:hidden"
            onSubmit={(event) => {
              event.preventDefault();
              if (results[0]) {
                router.push(`/product/${results[0].slug}`);
                setSearchOpen(false);
                setQuery("");
              }
            }}
          >
            <label htmlFor={`${searchId}-mobile`} className="sr-only">
              Search the collection
            </label>
            <input
              id={`${searchId}-mobile`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm outline-none placeholder:text-mute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            />
            {query.trim() && (
              <ul className="mt-2">
                {results.length === 0 ? (
                  <li className="px-2 py-2 text-sm text-mute">
                    No pieces match that search.
                  </li>
                ) : (
                  results.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-3 py-2"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                      >
                        <Image
                          src={product.image}
                          alt=""
                          width={40}
                          height={48}
                          className="h-12 w-10 object-cover"
                        />
                        <span className="text-sm">{product.name}</span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </form>
        )}

        {shopOpen && (
          <div className="absolute top-full right-0 left-0 hidden border-b border-line bg-paper shadow-[0_24px_40px_rgba(20,20,20,0.06)] lg:block">
            <div className="mx-auto max-w-[1400px] px-6 py-6">
              <StoreMenu onNavigate={visit} />
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <div ref={menuRef} className="fixed inset-0 z-30 overflow-y-auto bg-paper pt-16 lg:hidden">
          <nav className="flex flex-col overflow-y-auto px-6 py-8" aria-label="Mobile">
            <div className="flex items-center justify-between gap-4 border-b border-line py-4 sm:hidden">
              <span className="text-sm">Currency</span>
              <CurrencySwitcher id="mobile-currency" />
            </div>
            {links.map((link) =>
              link.shop ? (
                <div key={link.href} className="border-b border-line">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className="py-4 text-3xl tracking-tight"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={shopOpen}
                      aria-label={shopOpen ? "Close the store menu" : "Open the store menu"}
                      onClick={() => setShopOpen((open) => !open)}
                      className="grid size-11 place-items-center"
                    >
                      <Plus size={20} className={`transition-transform ${shopOpen ? "rotate-45" : ""}`} />
                    </button>
                  </div>
                  {shopOpen && (
                    <div className="pb-6">
                      <StoreMenu onNavigate={visit} />
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-line py-4 text-3xl tracking-tight"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}

      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
    </>
  );
}
