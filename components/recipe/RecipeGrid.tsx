import { RecipeCard } from "./RecipeCard";
import type { RecipeCard as RecipeCardType } from "@/lib/sanity/types";

export function RecipeGrid({ recipes }: { recipes: RecipeCardType[] }) {
  if (recipes.length === 0) {
    return (
      <div className="py-12 text-center text-brass-400">
        <p className="font-heading text-xl">No recipes found</p>
        <p className="mt-1 text-sm">Try changing your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
