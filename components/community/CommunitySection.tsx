"use client";
import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { RatingStars } from "./RatingStars";
import { ReviewSection } from "./ReviewSection";
import { FavoriteButton } from "./FavoriteButton";
import { MadeThisButton } from "./MadeThisButton";
import type { RecipeStats } from "@/lib/supabase/types";

export function CommunitySection({ slug }: { slug: string }) {
  const supabase = createSupabaseBrowser();
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<RecipeStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [madeThis, setMadeThis] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase.from("ratings").select("value").eq("recipe_slug", slug).eq("user_id", user.id).single().then(({ data }) => data && setUserRating(data.value));
        fetch(`/api/favorites?slug=${slug}`).then((r) => r.json()).then((data) => setFavorited(data.length > 0));
        supabase.from("made_this").select("id").eq("recipe_slug", slug).eq("user_id", user.id).single().then(({ data }) => setMadeThis(!!data));
      }
    });
    supabase.rpc("get_recipe_stats", { slug }).then(({ data }) => { if (data) setStats(data as RecipeStats); });
  }, [slug, supabase]);

  async function handleRate(value: number) {
    const res = await fetch("/api/ratings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipe_slug: slug, value }) });
    if (res.ok) { setUserRating(value); supabase.rpc("get_recipe_stats", { slug }).then(({ data }) => data && setStats(data as RecipeStats)); }
  }

  const isLoggedIn = !!userId;

  return (
    <div className="space-y-6">
      <div className="kolam-divider" />
      <RatingStars currentRating={stats?.avg_rating ?? null} userRating={userRating} ratingCount={stats?.rating_count ?? 0}
        onRate={isLoggedIn ? handleRate : () => (window.location.href = "/auth/login")} disabled={!isLoggedIn} />
      <div className="flex gap-2">
        <FavoriteButton slug={slug} initialFavorited={favorited} isLoggedIn={isLoggedIn} />
        <MadeThisButton slug={slug} initialMade={madeThis} madeCount={stats?.made_this_count ?? 0} isLoggedIn={isLoggedIn} />
      </div>
      <ReviewSection slug={slug} isLoggedIn={isLoggedIn} />
    </div>
  );
}
