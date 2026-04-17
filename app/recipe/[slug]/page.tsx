import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { recipeBySlugQuery, allSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { SpiceIndicator } from "@/components/recipe/SpiceIndicator";
import { DietDot } from "@/components/recipe/DietDot";
import { HealthyBadge } from "@/components/recipe/HealthyBadge";
import { YouTubeEmbed } from "@/components/recipe/YouTubeEmbed";
import { CulturalStory } from "@/components/recipe/CulturalStory";
import { ShareButton } from "@/components/recipe/ShareButton";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { REGION_LABELS, OCCASION_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { Recipe } from "@/lib/sanity/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(allSlugsQuery);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe: Recipe | null = await sanityClient.fetch(recipeBySlugQuery, { slug });
  if (!recipe) return {};

  const region = REGION_LABELS[recipe.region] || recipe.region;
  return {
    title: `${recipe.name_telugu} (${recipe.name_english}) — Andhra Vantalu`,
    description: `Authentic ${region} recipe for ${recipe.name_english}. ${recipe.diet === "veg" ? "Vegetarian" : "Non-Vegetarian"}.`,
    openGraph: {
      title: `${recipe.name_telugu} (${recipe.name_english})`,
      description: `Authentic ${region} recipe`,
      type: "article",
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe: Recipe | null = await sanityClient.fetch(recipeBySlugQuery, { slug });

  if (!recipe) notFound();

  const heroUrl = recipe.hero_image
    ? urlFor(recipe.hero_image).width(800).height(500).url()
    : null;

  const shareableRecipe = {
    slug: recipe.slug.current,
    name_english: recipe.name_english,
    name_telugu: recipe.name_telugu,
    region: recipe.region,
    spice_level: recipe.spice_level,
    diet: recipe.diet,
  };

  return (
    <article className="space-y-6">
      {heroUrl && (
        <div className="relative -mx-4 -mt-4 aspect-[16/10] overflow-hidden">
          <Image src={heroUrl} alt={recipe.name_english} fill className="object-cover" priority />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <DietDot diet={recipe.diet} />
          {recipe.is_healthy && <HealthyBadge />}
        </div>
        <h1 className="mt-2 font-telugu text-3xl font-bold text-tamarind-500">{recipe.name_telugu}</h1>
        <p className="font-heading text-xl text-tamarind-300">{recipe.name_english}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-brass-500">
          <span>{REGION_LABELS[recipe.region]}</span>
          <span>·</span>
          {recipe.spice_level && !recipe.meal_type.includes("sweets") && (
            <>
              <SpiceIndicator level={recipe.spice_level} />
              <span>·</span>
            </>
          )}
          {recipe.difficulty && (
            <>
              <span>{DIFFICULTY_LABELS[recipe.difficulty]}</span>
              <span>·</span>
            </>
          )}
          {recipe.cook_time_minutes && <span>{recipe.cook_time_minutes} min</span>}
        </div>

        {recipe.occasion && recipe.occasion.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {recipe.occasion.map((occ) => (
              <span key={occ} className="rounded-full bg-turmeric-50 px-2 py-0.5 text-xs text-turmeric-700">
                {OCCASION_LABELS[occ]}
              </span>
            ))}
          </div>
        )}
      </div>

      <ShareButton recipe={shareableRecipe} />

      {recipe.youtube_url && <YouTubeEmbed url={recipe.youtube_url} />}

      <section>
        <h2 className="mb-3 font-heading text-xl text-tamarind-500">Ingredients / పదార్థాలు</h2>
        <div className="kolam-divider" />
        <ul className="space-y-2">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i} className="flex items-baseline justify-between border-b border-brass-100 pb-1">
              <div>
                <span className="text-tamarind-500">{ing.name_english}</span>
                {ing.name_telugu && (
                  <span className="ml-2 font-telugu-body text-sm text-brass-400">({ing.name_telugu})</span>
                )}
              </div>
              <span className="shrink-0 text-sm text-brass-500">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl text-tamarind-500">Instructions / తయారీ విధానం</h2>
        <div className="kolam-divider" />
        <div className="prose prose-sm text-tamarind-400">
          <PortableText value={recipe.instructions} />
        </div>
      </section>

      <CulturalStory story={recipe.cultural_story} recipeName={recipe.name_english} />

      {recipe.tips && recipe.tips.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl text-tamarind-500">Tips & Variations</h2>
          <div className="prose prose-sm text-tamarind-400">
            <PortableText value={recipe.tips} />
          </div>
        </section>
      )}

      <div id="community" />

      {recipe.related_recipes && recipe.related_recipes.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl text-tamarind-500">Related Recipes</h2>
          <RecipeGrid recipes={recipe.related_recipes} />
        </section>
      )}
    </article>
  );
}
