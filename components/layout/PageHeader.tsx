import Link from "next/link";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brass-100 bg-cream-100/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold text-tamarind-500">
            Andhra Vantalu
          </span>
          <span className="font-telugu text-sm text-brass-500">
            ఆంధ్ర వంటలు
          </span>
        </Link>
      </div>
    </header>
  );
}
