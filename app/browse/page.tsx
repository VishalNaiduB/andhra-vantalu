import { Suspense } from "react";
import { sanityClient } from "@/lib/sanity/client";
import { allRecipeCardsQuery, searchRecipesQuery } from "@/lib/sanity/queries";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { FilterPanel } from "@/components/browse/FilterPanel";
import type { RecipeCard } from "@/lib/sanity/types";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{
    q?: string;
    meal?: string;
    diet?: string;
    region?: string;
    spice?: string;
    occasion?: string;
    difficulty?: string;
    healthy?: string;
  }>;
};

export default async function BrowsePage({ searchParams }: Props) {
  const params = await searchParams;
  let recipes: RecipeCard[];

  if (params.q) {
    recipes = await sanityClient.fetch<RecipeCard[]>(searchRecipesQuery, { searchTerm: params.q });
  } else {
    recipes = await sanityClient.fetch(allRecipeCardsQuery);
  }

  const filtered = recipes.filter((r) => {
    if (params.meal && !r.meal_type.includes(params.meal)) return false;
    if (params.diet && r.diet !== params.diet) return false;
    if (params.region && r.region !== params.region) return false;
    if (params.spice && r.spice_level !== params.spice) return false;
    if (params.healthy === "true" && !r.is_healthy) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-tamarind-500">
        Browse Recipes
      </h1>

      <form action="/browse" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search recipes in English or Telugu..."
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none focus:ring-1 focus:ring-turmeric-400"
        />
      </form>

      <Suspense fallback={null}>
        <FilterPanel />
      </Suspense>

      <div className="kolam-divider" />

      <p className="text-xs text-brass-400">
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
      </p>
      <RecipeGrid recipes={filtered} />
    </div>
  );
}
