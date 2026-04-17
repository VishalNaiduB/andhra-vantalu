-- Profiles (auto-created on signup via trigger)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  bio text,
  region text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Ratings (1 per user per recipe)
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  recipe_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  value integer not null check (value between 1 and 5),
  created_at timestamptz default now(),
  unique(recipe_slug, user_id)
);

-- Reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  recipe_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  body text not null check (char_length(body) > 0),
  created_at timestamptz default now()
);

-- Favorites
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  recipe_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(recipe_slug, user_id)
);

-- Made This
create table public.made_this (
  id uuid default gen_random_uuid() primary key,
  recipe_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(recipe_slug, user_id)
);

-- Community Submissions
create table public.community_submissions (
  id uuid default gen_random_uuid() primary key,
  name_english text not null,
  name_telugu text,
  meal_type text[] not null,
  diet text not null check (diet in ('veg', 'nonveg')),
  region text,
  spice_level text,
  is_healthy boolean default false,
  occasion text[],
  difficulty text,
  cook_time_minutes integer,
  ingredients jsonb,
  instructions text[],
  cultural_story text,
  tips text,
  youtube_url text,
  submitted_by uuid references public.profiles(id) on delete cascade not null,
  attribution text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  submitted_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.ratings enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.made_this enable row level security;
alter table public.community_submissions enable row level security;

-- Profiles
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Ratings
create policy "ratings_select" on public.ratings for select using (true);
create policy "ratings_insert" on public.ratings for insert with check (auth.uid() = user_id);
create policy "ratings_update" on public.ratings for update using (auth.uid() = user_id);

-- Reviews
create policy "reviews_select" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = user_id);

-- Favorites
create policy "favorites_select" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on public.favorites for delete using (auth.uid() = user_id);

-- Made This
create policy "made_this_select" on public.made_this for select using (auth.uid() = user_id);
create policy "made_this_insert" on public.made_this for insert with check (auth.uid() = user_id);
create policy "made_this_delete" on public.made_this for delete using (auth.uid() = user_id);

-- Public count function (for displaying stats to anonymous users)
create or replace function public.get_recipe_stats(slug text)
returns json as $$
  select json_build_object(
    'avg_rating', (select round(avg(value), 1) from public.ratings where recipe_slug = slug),
    'rating_count', (select count(*) from public.ratings where recipe_slug = slug),
    'review_count', (select count(*) from public.reviews where recipe_slug = slug),
    'made_this_count', (select count(*) from public.made_this where recipe_slug = slug)
  );
$$ language sql security definer;

-- Community Submissions
create policy "submissions_select_own" on public.community_submissions
  for select using (auth.uid() = submitted_by);
create policy "submissions_select_admin" on public.community_submissions
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "submissions_insert" on public.community_submissions
  for insert with check (auth.uid() = submitted_by);
create policy "submissions_update_admin" on public.community_submissions
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_ratings_recipe on public.ratings(recipe_slug);
create index idx_reviews_recipe on public.reviews(recipe_slug);
create index idx_favorites_user on public.favorites(user_id);
create index idx_made_this_user on public.made_this(user_id);
create index idx_submissions_status on public.community_submissions(status);
