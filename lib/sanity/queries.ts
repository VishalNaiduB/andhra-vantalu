import { groq } from "next-sanity";

const recipeCardFields = groq`
  _id,
  name_english,
  name_telugu,
  slug,
  meal_type,
  diet,
  region,
  spice_level,
  is_healthy,
  cook_time_minutes,
  hero_image
`;

export const allRecipeCardsQuery = groq`
  *[_type == "recipe"] | order(name_english asc) {
    ${recipeCardFields}
  }
`;

export const recipeBySlugQuery = groq`
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    name_english,
    name_telugu,
    slug,
    meal_type,
    diet,
    region,
    spice_level,
    is_healthy,
    occasion,
    difficulty,
    cook_time_minutes,
    hero_image,
    ingredients,
    instructions,
    cultural_story,
    tips,
    youtube_url,
    step_images,
    "related_recipes": related_recipes[]-> {
      ${recipeCardFields}
    },
    featured
  }
`;

export const featuredRecipesQuery = groq`
  *[_type == "recipe" && featured == true] | order(_createdAt desc)[0..4] {
    ${recipeCardFields}
  }
`;

export const recipesByMealTypeQuery = groq`
  *[_type == "recipe" && $mealType in meal_type] | order(name_english asc) {
    ${recipeCardFields}
  }
`;

export const allSlugsQuery = groq`
  *[_type == "recipe"]{ "slug": slug.current }
`;

export const searchRecipesQuery = groq`
  *[_type == "recipe" && (
    name_english match $query + "*" ||
    name_telugu match $query + "*"
  )] | order(name_english asc) {
    ${recipeCardFields}
  }
`;

export const culturalStoriesQuery = groq`
  *[_type == "recipe" && defined(cultural_story)] | order(name_english asc) {
    _id,
    name_english,
    name_telugu,
    slug,
    region,
    hero_image,
    cultural_story
  }
`;
