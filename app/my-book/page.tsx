"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { sanityClient } from "@/lib/sanity/client";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import type { RecipeCard } from "@/lib/sanity/types";
import { groq } from "next-sanity";

type Tab = "favorites" | "made";

export default function MyBookPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [tab, setTab] = useState<Tab>("favorites");
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function loadRecipes(userId: string, currentTab: Tab) {
    setLoading(true);
    const table = currentTab === "favorites" ? "favorites" : "made_this";
    const { data } = await supabase.from(table).select("recipe_slug").eq("user_id", userId);
    if (data && data.length > 0) {
      const slugs = data.map((d) => d.recipe_slug);
      const query = groq`*[_type == "recipe" && slug.current in $slugs]{ _id, name_english, name_telugu, slug, meal_type, diet, region, spice_level, is_healthy, cook_time_minutes, hero_image }`;
      const recipes = await sanityClient.fetch(query, { slugs });
      setRecipes(recipes);
    } else { setRecipes([]); }
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      setIsLoggedIn(true);
      loadRecipes(user.id, tab);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (!isLoggedIn) return null;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-tamarind-500">My Book / నా పుస్తకం</h1>
      <div className="flex gap-2">
        {(["favorites", "made"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-turmeric-500 text-white" : "border border-brass-200 bg-white text-tamarind-400"}`}>
            {t === "favorites" ? "❤️ Saved" : "🍳 I Made This"}
          </button>
        ))}
      </div>
      <div className="kolam-divider" />
      {loading ? <p className="py-8 text-center text-brass-400">Loading...</p> : <RecipeGrid recipes={recipes} />}
    </div>
  );
}
