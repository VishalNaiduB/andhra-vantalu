import { REGION_LABELS, SPICE_LEVELS } from "./constants";

export type ShareableRecipe = {
  slug: string;
  name_english: string;
  name_telugu: string;
  region: string;
  spice_level: string;
  diet: "veg" | "nonveg";
};

export function getSpiceEmoji(level: string): string {
  return SPICE_LEVELS[level]?.emoji ?? "";
}

export function buildWhatsAppMessage(
  recipe: ShareableRecipe,
  baseUrl: string
): string {
  const spice = getSpiceEmoji(recipe.spice_level);
  const region = REGION_LABELS[recipe.region] ?? recipe.region;
  const diet = recipe.diet === "veg" ? "Veg" : "Non-Veg";
  const url = `${baseUrl}/recipe/${recipe.slug}`;

  return [
    `${recipe.name_telugu} (${recipe.name_english}) ${spice}`,
    `${region} · ${diet}`,
    "",
    `Try this authentic recipe:`,
    url,
    "",
    `via Andhra Vantalu 🍛`,
  ].join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `whatsapp://send?text=${encodeURIComponent(message)}`;
}

export function buildShareData(
  recipe: ShareableRecipe,
  baseUrl: string
): ShareData {
  const spice = getSpiceEmoji(recipe.spice_level);
  const region = REGION_LABELS[recipe.region] ?? recipe.region;

  return {
    title: `${recipe.name_telugu} (${recipe.name_english})`,
    text: `Authentic ${region} recipe ${spice}`,
    url: `${baseUrl}/recipe/${recipe.slug}`,
  };
}
