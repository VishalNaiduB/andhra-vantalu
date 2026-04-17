export type Ingredient = {
  name_english: string;
  name_telugu: string;
  quantity: string;
};

export type Recipe = {
  _id: string;
  name_english: string;
  name_telugu: string;
  slug: { current: string };
  meal_type: string[];
  diet: "veg" | "nonveg";
  region: string;
  spice_level: string;
  is_healthy: boolean;
  occasion: string[];
  difficulty: string;
  cook_time_minutes: number;
  hero_image: any;
  ingredients: Ingredient[];
  instructions: any[];
  cultural_story: any[];
  tips: any[];
  youtube_url?: string;
  step_images?: any[];
  related_recipes?: Recipe[];
  featured?: boolean;
};

export type RecipeCard = Pick<
  Recipe,
  | "_id"
  | "name_english"
  | "name_telugu"
  | "slug"
  | "meal_type"
  | "diet"
  | "region"
  | "spice_level"
  | "is_healthy"
  | "cook_time_minutes"
  | "hero_image"
>;
