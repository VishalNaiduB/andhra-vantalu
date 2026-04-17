"use client";
import { useState } from "react";

export function FavoriteButton({ slug, initialFavorited, isLoggedIn }: { slug: string; initialFavorited: boolean; isLoggedIn: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) { window.location.href = "/auth/login"; return; }
    setLoading(true);
    const res = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipe_slug: slug }) });
    if (res.ok) { const { favorited: f } = await res.json(); setFavorited(f); }
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        favorited ? "border-curry-red-300 bg-curry-red-50 text-curry-red-600" : "border-brass-200 bg-white text-tamarind-400 hover:bg-cream-100"
      }`}>{favorited ? "❤️ Saved" : "🤍 Save"}</button>
  );
}
