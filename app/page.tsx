import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { featuredRecipesQuery, recipesByMealTypeQuery } from "@/lib/sanity/queries";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import type { RecipeCard } from "@/lib/sanity/types";

const quickFilters = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snacks", value: "snacks" },
  { label: "Sweets", value: "sweets" },
];

export const revalidate = 60;

export default async function HomePage() {
  const featured: RecipeCard[] = await sanityClient.fetch(featuredRecipesQuery);
  const breakfastRecipes: RecipeCard[] = await sanityClient.fetch(
    recipesByMealTypeQuery,
    { mealType: "breakfast" }
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-br from-turmeric-100 to-cream-200 p-6 text-center">
        <h1 className="font-heading text-3xl font-bold text-tamarind-500">
          Andhra Vantalu
        </h1>
        <p className="font-telugu mt-1 text-lg text-brass-600">
          ఆంధ్ర వంటలు — అమ్మ చేతి వంట
        </p>
        <p className="mt-2 text-sm text-tamarind-300">
          Authentic recipes from the heart of Andhra Pradesh
        </p>
      </section>

      {/* Quick Filters */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickFilters.map((filter) => (
            <Link
              key={filter.value}
              href={`/browse?meal=${filter.value}`}
              className="shrink-0 rounded-full border border-brass-200 bg-white px-4 py-2 text-sm font-medium text-tamarind-400 transition-colors hover:border-turmeric-400 hover:bg-turmeric-50"
            >
              {filter.label}
            </Link>
          ))}
          <Link
            href="/browse?healthy=true"
            className="shrink-0 rounded-full border border-curry-leaf-200 bg-curry-leaf-50 px-4 py-2 text-sm font-medium text-curry-leaf-700 transition-colors hover:bg-curry-leaf-100"
          >
            🌿 Healthy
          </Link>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl text-tamarind-500">
            Featured Recipes
          </h2>
          <div className="kolam-divider" />
          <RecipeGrid recipes={featured} />
        </section>
      )}

      {/* Breakfast Picks */}
      {breakfastRecipes.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl text-tamarind-500">
              Breakfast / టిఫిన్
            </h2>
            <Link
              href="/browse?meal=breakfast"
              className="text-sm text-curry-red-500 hover:underline"
            >
              See all →
            </Link>
          </div>
          <RecipeGrid recipes={breakfastRecipes.slice(0, 4)} />
        </section>
      )}

      {/* Cultural Archive CTA */}
      <section className="parchment text-center">
        <h2 className="font-heading text-xl text-tamarind-500">
          Stories Behind Our Food
        </h2>
        <p className="mt-2 text-sm text-tamarind-300">
          Every dish has a story — from village festivals to grandmother&apos;s
          kitchens. Discover the heritage behind Andhra cuisine.
        </p>
        <Link
          href="/archive"
          className="mt-4 inline-block rounded-lg bg-tamarind-500 px-6 py-2 text-sm font-medium text-cream-100 transition-colors hover:bg-tamarind-600"
        >
          Explore the Archive
        </Link>
      </section>
    </div>
  );
}
