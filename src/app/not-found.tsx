import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-6">
      <h1 className="text-4xl tracking-tight">This page is not in the store.</h1>
      <p className="mt-4 text-mute">The link may be out of date.</p>
      <Link
        href="/shop"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
      >
        Browse the store
      </Link>
    </div>
  );
}
