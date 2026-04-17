"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/browse", label: "Browse", icon: "🔍" },
  { href: "/my-book", label: "My Book", icon: "📖" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/studio") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-brass-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs transition-colors ${
                isActive
                  ? "text-curry-red-500"
                  : "text-brass-400 hover:text-tamarind-400"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
