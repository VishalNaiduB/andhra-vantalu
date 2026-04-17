import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { SpiceIndicator } from "./SpiceIndicator";
import { DietDot } from "./DietDot";
import { HealthyBadge } from "./HealthyBadge";
import type { RecipeCard as RecipeCardType } from "@/lib/sanity/types";

export function RecipeCard({ recipe }: { recipe: RecipeCardType }) {
  const imageUrl = recipe.hero_image
    ? urlFor(recipe.hero_image).width(400).height(300).url()
    : null;

  return (
    <Link
      href={`/recipe/${recipe.slug.current}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.name_english}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-telugu text-2xl text-brass-300">
            {recipe.name_telugu}
          </div>
        )}
        {recipe.is_healthy && (
          <div className="absolute right-2 top-2">
            <HealthyBadge />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1 flex items-center gap-2">
          <DietDot diet={recipe.diet} />
          <h3 className="font-telugu text-lg leading-tight text-tamarind-500">
            {recipe.name_telugu}
          </h3>
        </div>
        <p className="text-sm text-tamarind-300">{recipe.name_english}</p>

        <div className="mt-2 flex items-center justify-between">
          <SpiceIndicator level={recipe.spice_level} />
          {recipe.cook_time_minutes && (
            <span className="text-xs text-brass-500">
              {recipe.cook_time_minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
