"use client";
import { useState } from "react";

export function MadeThisButton({ slug, initialMade, madeCount, isLoggedIn }: { slug: string; initialMade: boolean; madeCount: number; isLoggedIn: boolean }) {
  const [made, setMade] = useState(initialMade);
  const [count, setCount] = useState(madeCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) { window.location.href = "/auth/login"; return; }
    setLoading(true);
    const res = await fetch("/api/made-this", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipe_slug: slug }) });
    if (res.ok) { const { made: m } = await res.json(); setMade(m); setCount((c) => (m ? c + 1 : c - 1)); }
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        made ? "border-curry-leaf-300 bg-curry-leaf-50 text-curry-leaf-700" : "border-brass-200 bg-white text-tamarind-400 hover:bg-cream-100"
      }`}>🍳 {made ? "I made this!" : "I made this"} ({count})</button>
  );
}
