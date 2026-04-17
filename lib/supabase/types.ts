export type Profile = {
  id: string;
  username: string;
  bio: string | null;
  region: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Rating = {
  id: string;
  recipe_slug: string;
  user_id: string;
  value: number;
  created_at: string;
};

export type Review = {
  id: string;
  recipe_slug: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: Pick<Profile, "username" | "avatar_url" | "region">;
};

export type Favorite = {
  id: string;
  recipe_slug: string;
  user_id: string;
  created_at: string;
};

export type MadeThis = {
  id: string;
  recipe_slug: string;
  user_id: string;
  created_at: string;
};

export type RecipeStats = {
  avg_rating: number | null;
  rating_count: number;
  review_count: number;
  made_this_count: number;
};

export type CommunitySubmission = {
  id: string;
  name_english: string;
  name_telugu: string | null;
  meal_type: string[];
  diet: string;
  region: string | null;
  spice_level: string | null;
  is_healthy: boolean;
  occasion: string[] | null;
  difficulty: string | null;
  cook_time_minutes: number | null;
  ingredients: any;
  instructions: string[] | null;
  cultural_story: string | null;
  tips: string | null;
  youtube_url: string | null;
  submitted_by: string;
  attribution: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  submitted_at: string;
};
