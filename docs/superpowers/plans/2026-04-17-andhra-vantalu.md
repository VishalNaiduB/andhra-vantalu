# Andhra Vantalu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Andhra Pradesh recipe website with curated content (Sanity CMS), community features (Supabase), and a nostalgic village-rooted design.

**Architecture:** Next.js App Router for SSG recipe pages + client-side community data. Sanity holds all editorial content (recipes, cultural stories). Supabase handles auth, ratings, reviews, favorites, "I made this", and community submissions.

**Tech Stack:** Next.js 15, Sanity v3, Supabase, Tailwind CSS 4, TypeScript

---

## File Structure

```
andhra-recipes/
├── app/
│   ├── layout.tsx                        # Root layout, fonts, BottomNav
│   ├── page.tsx                          # Home
│   ├── browse/page.tsx                   # Browse + Search + Filters
│   ├── recipe/[slug]/page.tsx            # Recipe detail (SSG)
│   ├── recipe/[slug]/opengraph-image.tsx # OG image for sharing
│   ├── archive/page.tsx                  # Cultural Archive
│   ├── my-book/page.tsx                  # Saved recipes
│   ├── profile/page.tsx                  # User profile
│   ├── submit/page.tsx                   # Submit a recipe
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts             # OAuth callback
│   ├── admin/
│   │   └── submissions/page.tsx          # Admin review queue
│   └── api/
│       ├── ratings/route.ts
│       ├── reviews/route.ts
│       ├── favorites/route.ts
│       ├── made-this/route.ts
│       └── submissions/route.ts
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   └── PageHeader.tsx
│   ├── recipe/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeGrid.tsx
│   │   ├── SpiceIndicator.tsx
│   │   ├── DietDot.tsx
│   │   ├── HealthyBadge.tsx
│   │   ├── YouTubeEmbed.tsx
│   │   ├── CulturalStory.tsx
│   │   └── ShareButton.tsx
│   ├── browse/
│   │   └── FilterPanel.tsx
│   └── community/
│       ├── RatingStars.tsx
│       ├── ReviewSection.tsx
│       ├── MadeThisButton.tsx
│       └── FavoriteButton.tsx
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── share.ts
│   └── constants.ts
├── sanity/
│   ├── schemaTypes/
│   │   ├── recipe.ts
│   │   └── index.ts
│   ├── env.ts
│   └── lib/
│       └── image.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── scripts/
│   └── import-recipes.sh
├── __tests__/
│   ├── lib/
│   │   ├── share.test.ts
│   │   └── constants.test.ts
│   └── components/
│       ├── SpiceIndicator.test.tsx
│       └── DietDot.test.tsx
├── .env.local.example
├── sanity.config.ts
├── sanity.cli.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── jest.config.ts
└── jest.setup.ts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `jest.config.ts`, `jest.setup.ts`, `.env.local.example`, `tsconfig.json`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/vishalnaidu/Desktop/andhra-recipes
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias "@/*" --use-npm
```

Select defaults when prompted. This scaffolds the App Router project with Tailwind.

- [ ] **Step 2: Install Sanity dependencies**

```bash
npm install next-sanity @sanity/client @sanity/image-url @portabletext/react sanity
```

- [ ] **Step 3: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 4: Install test dependencies**

```bash
npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

- [ ] **Step 5: Create Jest config**

Create `jest.config.ts`:

```typescript
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterSetup: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
```

Create `jest.setup.ts`:

```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 6: Create environment file template**

Create `.env.local.example`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-17

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 7: Add scripts to package.json**

Add to `"scripts"`:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8: Verify setup**

Run: `npm run dev`
Expected: Next.js dev server starts at localhost:3000

Run: `npm test -- --passWithNoTests`
Expected: Jest runs with no test suites, exits 0

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Sanity, Supabase, and Jest"
```

---

### Task 2: Design System — Tailwind Config & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Configure Tailwind theme**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turmeric: {
          50: "#FFF9E6",
          100: "#FFF0BF",
          200: "#FFE599",
          300: "#FFD966",
          400: "#FFCC33",
          500: "#D4A017",
          600: "#B8860B",
          700: "#8B6914",
          800: "#5C4A0E",
          900: "#2E2507",
        },
        tamarind: {
          50: "#F5EDE8",
          100: "#E0CCC0",
          200: "#C4A089",
          300: "#8B5E3C",
          400: "#6B4226",
          500: "#4A2C17",
          600: "#3D2412",
          700: "#2F1B0E",
          800: "#221309",
          900: "#150C05",
        },
        "curry-red": {
          50: "#FDECE6",
          100: "#F9C9B8",
          200: "#E8916B",
          300: "#D16835",
          400: "#C25422",
          500: "#B5451B",
          600: "#963A17",
          700: "#772E12",
          800: "#58220E",
          900: "#3A1709",
        },
        "curry-leaf": {
          50: "#E8F5E8",
          100: "#C2E2C2",
          200: "#7BBF7B",
          300: "#4A9E4A",
          400: "#38823A",
          500: "#2D6A2D",
          600: "#255725",
          700: "#1D441D",
          800: "#153115",
          900: "#0D1F0D",
        },
        brass: {
          50: "#F8F2E8",
          100: "#ECDCBE",
          200: "#D4BC8A",
          300: "#C5A46B",
          400: "#B08D57",
          500: "#9A7B4A",
          600: "#7D643C",
          700: "#604D2E",
          800: "#433620",
          900: "#261F12",
        },
        cream: {
          50: "#FEFCF7",
          100: "#FAF3E0",
          200: "#F5E6C8",
          300: "#EDD9AF",
          400: "#E5CC96",
          500: "#DDBF7D",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        telugu: ['"Noto Serif Telugu"', "serif"],
        "telugu-body": ['"Noto Sans Telugu"', "sans-serif"],
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Write global CSS**

Replace `app/globals.css`:

```css
@import "tailwindcss";

@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Serif+Telugu:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;500&display=swap");

@layer base {
  :root {
    --color-cream: #faf3e0;
    --color-turmeric: #d4a017;
    --color-tamarind: #4a2c17;
    --color-curry-red: #b5451b;
    --color-curry-leaf: #2d6a2d;
    --color-brass: #b08d57;
    --color-copper: #b87333;
  }

  body {
    font-family: "Inter", system-ui, sans-serif;
    background-color: var(--color-cream);
    color: var(--color-tamarind);
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: "Playfair Display", Georgia, serif;
    color: var(--color-tamarind);
  }
}

@layer components {
  /* Parchment section for cultural stories */
  .parchment {
    background-color: #f5eed6;
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.04'/%3E%3C/svg%3E");
    border-left: 3px solid var(--color-brass);
    border-radius: 4px;
    padding: 1.5rem;
  }

  /* Kolam-inspired divider */
  .kolam-divider {
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      var(--color-brass),
      var(--color-brass) 8px,
      transparent 8px,
      transparent 12px,
      var(--color-turmeric) 12px,
      var(--color-turmeric) 16px,
      transparent 16px,
      transparent 20px
    );
    margin: 2rem 0;
  }

  /* Veg/Non-veg dot indicators */
  .diet-dot-veg {
    width: 12px;
    height: 12px;
    border: 2px solid #2d6a2d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .diet-dot-veg::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #2d6a2d;
  }

  .diet-dot-nonveg {
    width: 12px;
    height: 12px;
    border: 2px solid #b5451b;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .diet-dot-nonveg::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #b5451b;
  }
}

/* Safe area for mobile bottom nav */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

- [ ] **Step 3: Verify fonts render**

Run: `npm run dev`
Visit localhost:3000 — verify the page has cream background, serif heading fonts load.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add nostalgic Andhra design system — colors, fonts, textures"
```

---

### Task 3: Sanity Schema & Studio Setup

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `sanity/env.ts`, `sanity/schemaTypes/recipe.ts`, `sanity/schemaTypes/index.ts`, `sanity/lib/image.ts`

- [ ] **Step 1: Create Sanity project**

Go to [sanity.io/manage](https://sanity.io/manage), create a new project called "andhra-vantalu". Copy the project ID. Set dataset to `production`.

Add to `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-17
```

- [ ] **Step 2: Create Sanity env helper**

Create `sanity/env.ts`:

```typescript
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-17";
```

- [ ] **Step 3: Create Sanity config**

Create `sanity.config.ts`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

export default defineConfig({
  name: "andhra-vantalu",
  title: "Andhra Vantalu",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
```

Create `sanity.cli.ts`:

```typescript
import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./sanity/env";

export default defineCliConfig({ api: { projectId, dataset } });
```

- [ ] **Step 4: Create recipe schema**

Create `sanity/schemaTypes/recipe.ts`:

```typescript
import { defineType, defineField, defineArrayMember } from "sanity";

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({
      name: "name_english",
      title: "Name (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name_telugu",
      title: "Name (Telugu)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name_english", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meal_type",
      title: "Meal Type",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Breakfast", value: "breakfast" },
          { title: "Lunch", value: "lunch" },
          { title: "Dinner", value: "dinner" },
          { title: "Snacks", value: "snacks" },
          { title: "Sweets & Desserts", value: "sweets" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "diet",
      title: "Diet",
      type: "string",
      options: {
        list: [
          { title: "Veg", value: "veg" },
          { title: "Non-Veg", value: "nonveg" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      options: {
        list: [
          { title: "Coastal Andhra", value: "coastal-andhra" },
          { title: "Rayalaseema", value: "rayalaseema" },
          { title: "North Andhra", value: "north-andhra" },
          { title: "Godavari Region", value: "godavari" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "spice_level",
      title: "Spice Level",
      type: "string",
      options: {
        list: [
          { title: "🌶 Mild", value: "mild" },
          { title: "🌶🌶 Medium", value: "medium" },
          { title: "🌶🌶🌶 Spicy", value: "spicy" },
          { title: "🌶🌶🌶🌶 Extra Spicy", value: "extra-spicy" },
          { title: "🌶🌶🌶🌶🌶 Kramp", value: "kramp" },
        ],
      },
      hidden: ({ parent }) => parent?.meal_type?.includes("sweets"),
    }),
    defineField({
      name: "is_healthy",
      title: "Healthy Recipe",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "occasion",
      title: "Occasion",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Everyday", value: "everyday" },
          { title: "Festival", value: "festival" },
          { title: "Wedding", value: "wedding" },
          { title: "Fasting", value: "fasting" },
        ],
      },
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Medium", value: "medium" },
          { title: "Traditional (requires skill)", value: "traditional" },
        ],
      },
    }),
    defineField({
      name: "cook_time_minutes",
      title: "Cook Time (minutes)",
      type: "number",
    }),
    defineField({
      name: "hero_image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "name_english",
              type: "string",
              title: "Name (English)",
            },
            { name: "name_telugu", type: "string", title: "Name (Telugu)" },
            { name: "quantity", type: "string", title: "Quantity" },
          ],
          preview: {
            select: { title: "name_english", subtitle: "quantity" },
          },
        }),
      ],
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "cultural_story",
      title: "Cultural Story",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "tips",
      title: "Tips & Variations",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "youtube_url",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "step_images",
      title: "Step Images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "related_recipes",
      title: "Related Recipes",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "recipe" }] })],
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name_english",
      subtitle: "name_telugu",
      media: "hero_image",
    },
  },
});
```

Create `sanity/schemaTypes/index.ts`:

```typescript
import { recipeType } from "./recipe";

export const schemaTypes = [recipeType];
```

- [ ] **Step 5: Create image URL helper**

Create `sanity/lib/image.ts`:

```typescript
import createImageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: any) {
  return builder.image(source);
}
```

- [ ] **Step 6: Add Sanity Studio route**

Create `app/studio/[[...tool]]/page.tsx`:

```typescript
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Add to `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 7: Verify Sanity Studio loads**

Run: `npm run dev`
Visit `localhost:3000/studio`
Expected: Sanity Studio loads with the recipe schema visible.

- [ ] **Step 8: Commit**

```bash
git add sanity.config.ts sanity.cli.ts sanity/ app/studio/ next.config.ts
git commit -m "feat: add Sanity CMS with recipe schema and Studio route"
```

---

### Task 4: Supabase Setup — Tables & RLS

**Files:**
- Create: `supabase/migrations/001_initial.sql`

- [ ] **Step 1: Create Supabase project**

Go to [supabase.com/dashboard](https://supabase.com/dashboard), create a project called "andhra-vantalu". Copy the URL and anon key.

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

- [ ] **Step 2: Write migration SQL**

Create `supabase/migrations/001_initial.sql`:

```sql
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

-- Public count functions (for displaying counts to anonymous users)
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
```

- [ ] **Step 3: Run migration**

Go to Supabase Dashboard → SQL Editor → paste the contents of `001_initial.sql` → Run.

Verify all tables appear under Table Editor.

- [ ] **Step 4: Enable Google OAuth**

In Supabase Dashboard → Authentication → Providers → Google → Enable and add OAuth credentials.

- [ ] **Step 5: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase migration — profiles, ratings, reviews, favorites, submissions"
```

---

### Task 5: Data Access Layer — Sanity + Supabase Clients

**Files:**
- Create: `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `lib/sanity/types.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/types.ts`, `lib/constants.ts`

- [ ] **Step 1: Create Sanity client**

Create `lib/sanity/client.ts`:

```typescript
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
```

- [ ] **Step 2: Create Sanity types**

Create `lib/sanity/types.ts`:

```typescript
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
```

- [ ] **Step 3: Create Sanity queries**

Create `lib/sanity/queries.ts`:

```typescript
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
```

- [ ] **Step 4: Create Supabase browser client**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

- [ ] **Step 5: Create Supabase types**

Create `lib/supabase/types.ts`:

```typescript
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
```

- [ ] **Step 6: Create constants**

Create `lib/constants.ts`:

```typescript
export const REGION_LABELS: Record<string, string> = {
  "coastal-andhra": "Coastal Andhra",
  rayalaseema: "Rayalaseema",
  "north-andhra": "North Andhra",
  godavari: "Godavari Region",
};

export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
  sweets: "Sweets & Desserts",
};

export const SPICE_LEVELS: Record<string, { label: string; emoji: string }> = {
  mild: { label: "Mild", emoji: "🌶" },
  medium: { label: "Medium", emoji: "🌶🌶" },
  spicy: { label: "Spicy", emoji: "🌶🌶🌶" },
  "extra-spicy": { label: "Extra Spicy", emoji: "🌶🌶🌶🌶" },
  kramp: { label: "Kramp", emoji: "🌶🌶🌶🌶🌶" },
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  traditional: "Traditional",
};

export const OCCASION_LABELS: Record<string, string> = {
  everyday: "Everyday",
  festival: "Festival",
  wedding: "Wedding",
  fasting: "Fasting",
};
```

- [ ] **Step 7: Commit**

```bash
git add lib/ sanity/env.ts
git commit -m "feat: add data access layer — Sanity queries, Supabase clients, types"
```

---

### Task 6: Share Utility (TDD)

**Files:**
- Create: `lib/share.ts`, `__tests__/lib/share.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/share.test.ts`:

```typescript
import {
  getSpiceEmoji,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  buildShareData,
} from "@/lib/share";

const mockRecipe = {
  slug: "pesarattu",
  name_english: "Pesarattu",
  name_telugu: "పెసరట్టు",
  region: "coastal-andhra",
  spice_level: "medium",
  diet: "veg" as const,
};

describe("getSpiceEmoji", () => {
  it("returns single chilli for mild", () => {
    expect(getSpiceEmoji("mild")).toBe("🌶");
  });

  it("returns five chillies for kramp", () => {
    expect(getSpiceEmoji("kramp")).toBe("🌶🌶🌶🌶🌶");
  });

  it("returns empty string for unknown level", () => {
    expect(getSpiceEmoji("unknown")).toBe("");
  });
});

describe("buildWhatsAppMessage", () => {
  it("includes Telugu name, English name, and link", () => {
    const msg = buildWhatsAppMessage(
      mockRecipe,
      "https://andhra-vantalu.com"
    );
    expect(msg).toContain("పెసరట్టు");
    expect(msg).toContain("Pesarattu");
    expect(msg).toContain("https://andhra-vantalu.com/recipe/pesarattu");
  });

  it("includes spice emoji and region", () => {
    const msg = buildWhatsAppMessage(mockRecipe, "https://example.com");
    expect(msg).toContain("🌶🌶");
    expect(msg).toContain("Coastal Andhra");
  });

  it("includes branding", () => {
    const msg = buildWhatsAppMessage(mockRecipe, "https://example.com");
    expect(msg).toContain("Andhra Vantalu");
  });
});

describe("buildWhatsAppUrl", () => {
  it("creates encoded whatsapp deep link", () => {
    const url = buildWhatsAppUrl("hello world");
    expect(url).toBe("whatsapp://send?text=hello%20world");
  });
});

describe("buildShareData", () => {
  it("returns Web Share API compatible object", () => {
    const data = buildShareData(mockRecipe, "https://example.com");
    expect(data).toEqual({
      title: "పెసరట్టు (Pesarattu)",
      text: "Authentic Coastal Andhra recipe 🌶🌶",
      url: "https://example.com/recipe/pesarattu",
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest __tests__/lib/share.test.ts`
Expected: All tests FAIL — module not found.

- [ ] **Step 3: Implement share utility**

Create `lib/share.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest __tests__/lib/share.test.ts`
Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/share.ts __tests__/lib/share.test.ts
git commit -m "feat: add share utility with WhatsApp message builder (TDD)"
```

---

### Task 7: Core UI Components

**Files:**
- Create: `components/recipe/SpiceIndicator.tsx`, `components/recipe/DietDot.tsx`, `components/recipe/HealthyBadge.tsx`, `components/recipe/RecipeCard.tsx`, `components/recipe/RecipeGrid.tsx`, `components/recipe/YouTubeEmbed.tsx`, `components/recipe/CulturalStory.tsx`

- [ ] **Step 1: Create SpiceIndicator**

Create `components/recipe/SpiceIndicator.tsx`:

```tsx
import { SPICE_LEVELS } from "@/lib/constants";

export function SpiceIndicator({ level }: { level: string }) {
  const spice = SPICE_LEVELS[level];
  if (!spice) return null;

  return (
    <span className="text-sm" title={spice.label} aria-label={`Spice level: ${spice.label}`}>
      {spice.emoji}
    </span>
  );
}
```

- [ ] **Step 2: Create DietDot**

Create `components/recipe/DietDot.tsx`:

```tsx
export function DietDot({ diet }: { diet: "veg" | "nonveg" }) {
  const isVeg = diet === "veg";
  return (
    <span
      className={isVeg ? "diet-dot-veg" : "diet-dot-nonveg"}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    />
  );
}
```

- [ ] **Step 3: Create HealthyBadge**

Create `components/recipe/HealthyBadge.tsx`:

```tsx
export function HealthyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-curry-leaf-50 px-2 py-0.5 text-xs font-medium text-curry-leaf-700">
      🌿 Healthy
    </span>
  );
}
```

- [ ] **Step 4: Create RecipeCard**

Create `components/recipe/RecipeCard.tsx`:

```tsx
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
```

- [ ] **Step 5: Create RecipeGrid**

Create `components/recipe/RecipeGrid.tsx`:

```tsx
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
```

- [ ] **Step 6: Create YouTubeEmbed**

Create `components/recipe/YouTubeEmbed.tsx`:

```tsx
"use client";

import { useState } from "react";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export function YouTubeEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="relative aspect-video w-full overflow-hidden rounded-lg bg-black"
        aria-label="Play video"
      >
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-curry-red-500 p-4 text-white shadow-lg">
            ▶
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Tap to play
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="Recipe video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
```

- [ ] **Step 7: Create CulturalStory**

Create `components/recipe/CulturalStory.tsx`:

```tsx
import { PortableText } from "@portabletext/react";

export function CulturalStory({
  story,
  recipeName,
}: {
  story: any[];
  recipeName: string;
}) {
  if (!story || story.length === 0) return null;

  return (
    <section className="parchment my-6">
      <h3 className="mb-3 font-heading text-xl text-tamarind-500">
        The Story Behind {recipeName}
      </h3>
      <div className="prose prose-sm text-tamarind-400">
        <PortableText value={story} />
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add components/recipe/
git commit -m "feat: add core recipe UI components — cards, spice, diet, cultural story"
```

---

### Task 8: Layout — BottomNav, PageHeader, Root Layout

**Files:**
- Create: `components/layout/BottomNav.tsx`, `components/layout/PageHeader.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create BottomNav**

Create `components/layout/BottomNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/browse", label: "Browse", icon: "🔍" },
  { href: "/my-book", label: "My Book", icon: "📖" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on studio/admin routes
  if (pathname.startsWith("/studio") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-brass-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs transition-colors ${
                isActive
                  ? "text-curry-red-500"
                  : "text-brass-400 hover:text-tamarind-400"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create PageHeader**

Create `components/layout/PageHeader.tsx`:

```tsx
import Link from "next/link";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brass-100 bg-cream-100/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold text-tamarind-500">
            Andhra Vantalu
          </span>
          <span className="font-telugu text-sm text-brass-500">
            ఆంధ్ర వంటలు
          </span>
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andhra Vantalu — Authentic Andhra Pradesh Recipes",
  description:
    "Discover authentic Andhra Pradesh recipes — from Pesarattu to Gongura Mutton. Breakfast, lunch, dinner, snacks, and sweets from Coastal Andhra, Rayalaseema, Godavari, and North Andhra.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-100 pb-20 antialiased">
        <PageHeader />
        <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify layout**

Run: `npm run dev`
Visit localhost:3000 — verify header shows "Andhra Vantalu / ఆంధ్ర వంటలు", bottom nav has 4 tabs, cream background.

- [ ] **Step 5: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: add layout — header, bottom nav, root layout with nostalgic theme"
```

---

### Task 9: Home Page

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Build home page**

Replace `app/page.tsx`:

```tsx
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

export const revalidate = 3600; // ISR: revalidate every hour

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
          Every dish has a story — from village festivals to grandmother's
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
```

- [ ] **Step 2: Verify home page renders**

Run: `npm run dev`
Visit localhost:3000 — verify hero section, quick filter pills, and CTA render (recipe sections will be empty until content is added via Sanity).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page with hero, quick filters, featured recipes"
```

---

### Task 10: Browse & Search Page with Filters

**Files:**
- Create: `components/browse/FilterPanel.tsx`, `app/browse/page.tsx`

- [ ] **Step 1: Create FilterPanel**

Create `components/browse/FilterPanel.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  MEAL_TYPE_LABELS,
  REGION_LABELS,
  SPICE_LEVELS,
  OCCASION_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/constants";

type FilterGroup = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

const filterGroups: FilterGroup[] = [
  {
    key: "meal",
    label: "Meal Type",
    options: Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "diet",
    label: "Diet",
    options: [
      { value: "veg", label: "🟢 Veg" },
      { value: "nonveg", label: "🔴 Non-Veg" },
    ],
  },
  {
    key: "region",
    label: "Region",
    options: Object.entries(REGION_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "spice",
    label: "Spice Level",
    options: Object.entries(SPICE_LEVELS).map(([value, { label, emoji }]) => ({
      value,
      label: `${emoji} ${label}`,
    })),
  },
  {
    key: "occasion",
    label: "Occasion",
    options: Object.entries(OCCASION_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "difficulty",
    label: "Difficulty",
    options: Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
];

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key);
      if (current === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/browse");
  }, [router]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-4">
      {filterGroups.map((group) => (
        <div key={group.key}>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-brass-500">
            {group.label}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((opt) => {
              const isActive = searchParams.get(group.key) === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilter(group.key, opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-turmeric-500 text-white"
                      : "border border-brass-200 bg-white text-tamarind-400 hover:border-turmeric-400"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Healthy toggle */}
      <button
        onClick={() =>
          setFilter("healthy", searchParams.get("healthy") ? "" : "true")
        }
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          searchParams.get("healthy")
            ? "bg-curry-leaf-500 text-white"
            : "border border-curry-leaf-200 bg-curry-leaf-50 text-curry-leaf-700 hover:bg-curry-leaf-100"
        }`}
      >
        🌿 Healthy Only
      </button>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-curry-red-500 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create Browse page**

Create `app/browse/page.tsx`:

```tsx
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
    recipes = await sanityClient.fetch(searchRecipesQuery, {
      query: params.q,
    });
  } else {
    recipes = await sanityClient.fetch(allRecipeCardsQuery);
  }

  // Client-side-like filtering on server (fast since recipes are cached)
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

      {/* Search */}
      <form action="/browse" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search recipes in English or Telugu..."
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none focus:ring-1 focus:ring-turmeric-400"
        />
      </form>

      {/* Filters */}
      <Suspense fallback={null}>
        <FilterPanel />
      </Suspense>

      <div className="kolam-divider" />

      {/* Results */}
      <p className="text-xs text-brass-400">
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
      </p>
      <RecipeGrid recipes={filtered} />
    </div>
  );
}
```

- [ ] **Step 3: Verify browse page**

Run: `npm run dev`
Visit localhost:3000/browse — verify filters render, search bar is visible.

- [ ] **Step 4: Commit**

```bash
git add components/browse/ app/browse/
git commit -m "feat: add browse page with filters, search, and recipe grid"
```

---

### Task 11: Recipe Detail Page (SSG + OG Image)

**Files:**
- Create: `app/recipe/[slug]/page.tsx`, `app/recipe/[slug]/opengraph-image.tsx`, `components/recipe/ShareButton.tsx`

- [ ] **Step 1: Create ShareButton**

Create `components/recipe/ShareButton.tsx`:

```tsx
"use client";

import { buildWhatsAppMessage, buildWhatsAppUrl, buildShareData } from "@/lib/share";
import type { ShareableRecipe } from "@/lib/share";

export function ShareButton({ recipe }: { recipe: ShareableRecipe }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://andhra-vantalu.com";

  async function handleShare() {
    const shareData = buildShareData(recipe, baseUrl);
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to WhatsApp
      }
    }
    // Fallback: WhatsApp deep link
    const message = buildWhatsAppMessage(recipe, baseUrl);
    window.open(buildWhatsAppUrl(message), "_blank");
  }

  function handleWhatsApp() {
    const message = buildWhatsAppMessage(recipe, baseUrl);
    window.open(buildWhatsAppUrl(message), "_blank");
  }

  function handleCopyLink() {
    const url = `${baseUrl}/recipe/${recipe.slug}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-turmeric-600"
      >
        📤 Share
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        WhatsApp
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-lg border border-brass-200 bg-white px-3 py-2 text-sm text-tamarind-400 transition-colors hover:bg-cream-100"
      >
        🔗 Copy
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create Recipe Detail page**

Create `app/recipe/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import {
  recipeBySlugQuery,
  allSlugsQuery,
} from "@/lib/sanity/queries";
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
      {/* Hero Image */}
      {heroUrl && (
        <div className="relative -mx-4 -mt-4 aspect-[16/10] overflow-hidden">
          <Image
            src={heroUrl}
            alt={recipe.name_english}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title + Meta */}
      <div>
        <div className="flex items-center gap-2">
          <DietDot diet={recipe.diet} />
          {recipe.is_healthy && <HealthyBadge />}
        </div>
        <h1 className="mt-2 font-telugu text-3xl font-bold text-tamarind-500">
          {recipe.name_telugu}
        </h1>
        <p className="font-heading text-xl text-tamarind-300">
          {recipe.name_english}
        </p>

        {/* Tags */}
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
          {recipe.cook_time_minutes && (
            <span>{recipe.cook_time_minutes} min</span>
          )}
        </div>

        {/* Occasions */}
        {recipe.occasion && recipe.occasion.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {recipe.occasion.map((occ) => (
              <span
                key={occ}
                className="rounded-full bg-turmeric-50 px-2 py-0.5 text-xs text-turmeric-700"
              >
                {OCCASION_LABELS[occ]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Share */}
      <ShareButton recipe={shareableRecipe} />

      {/* YouTube */}
      {recipe.youtube_url && <YouTubeEmbed url={recipe.youtube_url} />}

      {/* Ingredients */}
      <section>
        <h2 className="mb-3 font-heading text-xl text-tamarind-500">
          Ingredients / పదార్థాలు
        </h2>
        <div className="kolam-divider" />
        <ul className="space-y-2">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i} className="flex items-baseline justify-between border-b border-brass-100 pb-1">
              <div>
                <span className="text-tamarind-500">{ing.name_english}</span>
                {ing.name_telugu && (
                  <span className="ml-2 font-telugu-body text-sm text-brass-400">
                    ({ing.name_telugu})
                  </span>
                )}
              </div>
              <span className="shrink-0 text-sm text-brass-500">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section>
        <h2 className="mb-3 font-heading text-xl text-tamarind-500">
          Instructions / తయారీ విధానం
        </h2>
        <div className="kolam-divider" />
        <div className="prose prose-sm text-tamarind-400">
          <PortableText value={recipe.instructions} />
        </div>
      </section>

      {/* Cultural Story */}
      <CulturalStory story={recipe.cultural_story} recipeName={recipe.name_english} />

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl text-tamarind-500">
            Tips & Variations
          </h2>
          <div className="prose prose-sm text-tamarind-400">
            <PortableText value={recipe.tips} />
          </div>
        </section>
      )}

      {/* Community section placeholder — wired in Task 14 */}
      <div id="community" />

      {/* Related Recipes */}
      {recipe.related_recipes && recipe.related_recipes.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl text-tamarind-500">
            Related Recipes
          </h2>
          <RecipeGrid recipes={recipe.related_recipes} />
        </section>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Create OG image route**

Create `app/recipe/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { sanityClient } from "@/lib/sanity/client";
import { recipeBySlugQuery } from "@/lib/sanity/queries";
import { REGION_LABELS, SPICE_LEVELS } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Andhra Vantalu Recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await sanityClient.fetch(recipeBySlugQuery, { slug });

  if (!recipe) {
    return new ImageResponse(
      <div style={{ display: "flex", fontSize: 40, background: "#FAF3E0", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        Andhra Vantalu
      </div>,
      { ...size }
    );
  }

  const region = REGION_LABELS[recipe.region] || recipe.region;
  const spice = SPICE_LEVELS[recipe.spice_level]?.emoji || "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #FAF3E0 0%, #FFF0BF 100%)",
          padding: 60,
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#B08D57", marginBottom: 12 }}>
          Andhra Vantalu
        </div>
        <div style={{ fontSize: 64, color: "#4A2C17", fontWeight: 700, lineHeight: 1.1 }}>
          {recipe.name_telugu}
        </div>
        <div style={{ fontSize: 36, color: "#6B4226", marginTop: 8 }}>
          {recipe.name_english}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20, fontSize: 24, color: "#8B5E3C" }}>
          <span>{region}</span>
          <span>·</span>
          <span>{recipe.diet === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}</span>
          <span>·</span>
          <span>{spice}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Verify recipe page**

Add a test recipe in Sanity Studio (localhost:3000/studio), then visit localhost:3000/recipe/[slug].
Verify: title, tags, ingredients, instructions, share buttons render.

- [ ] **Step 5: Commit**

```bash
git add app/recipe/ components/recipe/ShareButton.tsx
git commit -m "feat: add recipe detail page with SSG, OG image, and share buttons"
```

---

### Task 12: Auth Flow — Login, Register, Middleware

**Files:**
- Create: `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/callback/route.ts`, `middleware.ts`

- [ ] **Step 1: Create auth callback route**

Create `app/auth/callback/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
```

- [ ] **Step 2: Create login page**

Create `app/auth/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">Welcome Back</h1>
        <p className="mt-1 text-sm text-brass-400">
          Login to save recipes, rate, and share your own
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-brass-200 bg-white py-3 text-sm font-medium text-tamarind-500 transition-colors hover:bg-cream-100"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-brass-200" />
        <span className="text-xs text-brass-400">or</span>
        <div className="h-px flex-1 bg-brass-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none"
        />

        {error && <p className="text-sm text-curry-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-brass-400">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-curry-red-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create register page**

Create `app/auth/register/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">Join Andhra Vantalu</h1>
        <p className="mt-1 text-sm text-brass-400">
          Share your family recipes with the world
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none"
        />

        {error && <p className="text-sm text-curry-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-brass-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-curry-red-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create Supabase middleware for session refresh**

Create `middleware.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|studio).*)",
  ],
};
```

- [ ] **Step 5: Verify auth flow**

Run: `npm run dev`
Visit localhost:3000/auth/login — verify form renders.
Visit localhost:3000/auth/register — verify form renders.

- [ ] **Step 6: Commit**

```bash
git add app/auth/ middleware.ts
git commit -m "feat: add auth flow — login, register, Google OAuth, session middleware"
```

---

### Task 13: Community Features — Ratings, Reviews, Favorites, Made This

**Files:**
- Create: `app/api/ratings/route.ts`, `app/api/reviews/route.ts`, `app/api/favorites/route.ts`, `app/api/made-this/route.ts`
- Create: `components/community/RatingStars.tsx`, `components/community/ReviewSection.tsx`, `components/community/FavoriteButton.tsx`, `components/community/MadeThisButton.tsx`
- Create: `components/community/CommunitySection.tsx`

- [ ] **Step 1: Create ratings API route**

Create `app/api/ratings/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipe_slug, value } = await request.json();

  if (!recipe_slug || !value || value < 1 || value > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ratings")
    .upsert(
      { recipe_slug, user_id: user.id, value },
      { onConflict: "recipe_slug,user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 2: Create reviews API route**

Create `app/api/reviews/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(username, avatar_url, region)")
    .eq("recipe_slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipe_slug, body } = await request.json();

  if (!recipe_slug || !body?.trim()) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ recipe_slug, user_id: user.id, body: body.trim() })
    .select("*, profiles(username, avatar_url, region)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Create favorites API route**

Create `app/api/favorites/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");

  const query = supabase.from("favorites").select("*").eq("user_id", user.id);
  if (slug) query.eq("recipe_slug", slug);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipe_slug } = await request.json();

  // Toggle: if exists, delete; if not, insert
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("recipe_slug", recipe_slug)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  } else {
    await supabase.from("favorites").insert({ recipe_slug, user_id: user.id });
    return NextResponse.json({ favorited: true });
  }
}
```

- [ ] **Step 4: Create made-this API route**

Create `app/api/made-this/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipe_slug } = await request.json();

  // Toggle
  const { data: existing } = await supabase
    .from("made_this")
    .select("id")
    .eq("recipe_slug", recipe_slug)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("made_this").delete().eq("id", existing.id);
    return NextResponse.json({ made: false });
  } else {
    await supabase.from("made_this").insert({ recipe_slug, user_id: user.id });
    return NextResponse.json({ made: true });
  }
}
```

- [ ] **Step 5: Create RatingStars component**

Create `components/community/RatingStars.tsx`:

```tsx
"use client";

import { useState } from "react";

export function RatingStars({
  currentRating,
  userRating,
  ratingCount,
  onRate,
  disabled,
}: {
  currentRating: number | null;
  userRating: number | null;
  ratingCount: number;
  onRate: (value: number) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || userRating || 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => !disabled && setHovered(star)}
            onClick={() => !disabled && onRate(star)}
            disabled={disabled}
            className={`text-2xl transition-colors ${
              star <= display ? "text-turmeric-500" : "text-brass-200"
            } ${disabled ? "cursor-default" : "cursor-pointer"}`}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="text-sm text-brass-400">
        {currentRating ? `${currentRating}/5` : "No ratings"} ({ratingCount})
      </span>
    </div>
  );
}
```

- [ ] **Step 6: Create ReviewSection component**

Create `components/community/ReviewSection.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import type { Review } from "@/lib/supabase/types";

export function ReviewSection({
  slug,
  isLoggedIn,
}: {
  slug: string;
  isLoggedIn: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?slug=${slug}`)
      .then((r) => r.json())
      .then(setReviews);
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_slug: slug, body }),
    });

    if (res.ok) {
      const review = await res.json();
      setReviews((prev) => [review, ...prev]);
      setBody("");
    }
    setSubmitting(false);
  }

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg text-tamarind-500">
        Reviews ({reviews.length})
      </h3>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience..."
            className="flex-1 rounded-lg border border-brass-200 bg-white px-3 py-2 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-sm text-brass-400">
          <a href="/auth/login" className="text-curry-red-500 hover:underline">
            Login
          </a>{" "}
          to leave a review
        </p>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-tamarind-500">
                {(review as any).profiles?.username || "Anonymous"}
              </span>
              {(review as any).profiles?.region && (
                <span className="text-xs text-brass-400">
                  from {(review as any).profiles.region}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-tamarind-400">{review.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create FavoriteButton and MadeThisButton**

Create `components/community/FavoriteButton.tsx`:

```tsx
"use client";

import { useState } from "react";

export function FavoriteButton({
  slug,
  initialFavorited,
  isLoggedIn,
}: {
  slug: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = "/auth/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_slug: slug }),
    });
    if (res.ok) {
      const { favorited: f } = await res.json();
      setFavorited(f);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        favorited
          ? "border-curry-red-300 bg-curry-red-50 text-curry-red-600"
          : "border-brass-200 bg-white text-tamarind-400 hover:bg-cream-100"
      }`}
    >
      {favorited ? "❤️ Saved" : "🤍 Save"}
    </button>
  );
}
```

Create `components/community/MadeThisButton.tsx`:

```tsx
"use client";

import { useState } from "react";

export function MadeThisButton({
  slug,
  initialMade,
  madeCount,
  isLoggedIn,
}: {
  slug: string;
  initialMade: boolean;
  madeCount: number;
  isLoggedIn: boolean;
}) {
  const [made, setMade] = useState(initialMade);
  const [count, setCount] = useState(madeCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = "/auth/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/made-this", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_slug: slug }),
    });
    if (res.ok) {
      const { made: m } = await res.json();
      setMade(m);
      setCount((c) => (m ? c + 1 : c - 1));
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        made
          ? "border-curry-leaf-300 bg-curry-leaf-50 text-curry-leaf-700"
          : "border-brass-200 bg-white text-tamarind-400 hover:bg-cream-100"
      }`}
    >
      🍳 {made ? "I made this!" : "I made this"} ({count})
    </button>
  );
}
```

- [ ] **Step 8: Create CommunitySection wrapper**

Create `components/community/CommunitySection.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { RatingStars } from "./RatingStars";
import { ReviewSection } from "./ReviewSection";
import { FavoriteButton } from "./FavoriteButton";
import { MadeThisButton } from "./MadeThisButton";
import type { RecipeStats } from "@/lib/supabase/types";

export function CommunitySection({ slug }: { slug: string }) {
  const supabase = createSupabaseBrowser();
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<RecipeStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [madeThis, setMadeThis] = useState(false);

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        // Fetch user-specific data
        supabase
          .from("ratings")
          .select("value")
          .eq("recipe_slug", slug)
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => data && setUserRating(data.value));

        fetch(`/api/favorites?slug=${slug}`)
          .then((r) => r.json())
          .then((data) => setFavorited(data.length > 0));

        supabase
          .from("made_this")
          .select("id")
          .eq("recipe_slug", slug)
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => setMadeThis(!!data));
      }
    });

    // Fetch public stats
    supabase.rpc("get_recipe_stats", { slug }).then(({ data }) => {
      if (data) setStats(data as RecipeStats);
    });
  }, [slug, supabase]);

  async function handleRate(value: number) {
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_slug: slug, value }),
    });
    if (res.ok) {
      setUserRating(value);
      // Refresh stats
      supabase
        .rpc("get_recipe_stats", { slug })
        .then(({ data }) => data && setStats(data as RecipeStats));
    }
  }

  const isLoggedIn = !!userId;

  return (
    <div className="space-y-6">
      <div className="kolam-divider" />

      <RatingStars
        currentRating={stats?.avg_rating ?? null}
        userRating={userRating}
        ratingCount={stats?.rating_count ?? 0}
        onRate={isLoggedIn ? handleRate : () => (window.location.href = "/auth/login")}
        disabled={!isLoggedIn}
      />

      <div className="flex gap-2">
        <FavoriteButton slug={slug} initialFavorited={favorited} isLoggedIn={isLoggedIn} />
        <MadeThisButton
          slug={slug}
          initialMade={madeThis}
          madeCount={stats?.made_this_count ?? 0}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <ReviewSection slug={slug} isLoggedIn={isLoggedIn} />
    </div>
  );
}
```

- [ ] **Step 9: Wire CommunitySection into Recipe Detail page**

In `app/recipe/[slug]/page.tsx`, add the import at the top:

```typescript
import { CommunitySection } from "@/components/community/CommunitySection";
```

Replace the `<div id="community" />` placeholder with:

```tsx
<CommunitySection slug={recipe.slug.current} />
```

- [ ] **Step 10: Commit**

```bash
git add app/api/ components/community/ app/recipe/
git commit -m "feat: add community features — ratings, reviews, favorites, made-this"
```

---

### Task 14: Cultural Archive Page

**Files:**
- Create: `app/archive/page.tsx`

- [ ] **Step 1: Build archive page**

Create `app/archive/page.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { culturalStoriesQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { REGION_LABELS } from "@/lib/constants";

export const revalidate = 3600;

export default async function ArchivePage() {
  const stories = await sanityClient.fetch(culturalStoriesQuery);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">
          Cultural Archive
        </h1>
        <p className="font-telugu mt-1 text-lg text-brass-500">
          మన వంటకాల కథలు
        </p>
        <p className="mt-2 text-sm text-tamarind-300">
          The stories, traditions, and heritage behind Andhra cuisine
        </p>
      </div>

      <div className="kolam-divider" />

      <div className="space-y-8">
        {stories.map((story: any) => {
          const imageUrl = story.hero_image
            ? urlFor(story.hero_image).width(600).height(300).url()
            : null;

          return (
            <article key={story._id} className="parchment">
              {imageUrl && (
                <div className="relative -mx-6 -mt-6 mb-4 aspect-[2/1] overflow-hidden rounded-t">
                  <Image
                    src={imageUrl}
                    alt={story.name_english}
                    fill
                    className="object-cover sepia-[.2]"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <h2 className="font-telugu text-xl text-tamarind-500">
                  {story.name_telugu}
                </h2>
                <span className="text-sm text-brass-400">
                  ({story.name_english})
                </span>
              </div>
              <p className="mb-3 text-xs text-brass-500">
                {REGION_LABELS[story.region]}
              </p>
              <div className="prose prose-sm text-tamarind-400 line-clamp-6">
                <PortableText value={story.cultural_story} />
              </div>
              <Link
                href={`/recipe/${story.slug.current}`}
                className="mt-3 inline-block text-sm text-curry-red-500 hover:underline"
              >
                View full recipe →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/archive/
git commit -m "feat: add cultural archive page with sepia-toned story cards"
```

---

### Task 15: My Book & Profile Pages

**Files:**
- Create: `app/my-book/page.tsx`, `app/profile/page.tsx`

- [ ] **Step 1: Build My Book page**

Create `app/my-book/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { sanityClient } from "@/lib/sanity/client";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import type { RecipeCard } from "@/lib/sanity/types";
import { groq } from "next-sanity";

type Tab = "favorites" | "made";

export default function MyBookPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [tab, setTab] = useState<Tab>("favorites");
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setIsLoggedIn(true);
      loadRecipes(user.id, tab);
    });
  }, [tab]);

  async function loadRecipes(userId: string, currentTab: Tab) {
    setLoading(true);
    const table = currentTab === "favorites" ? "favorites" : "made_this";
    const { data } = await supabase
      .from(table)
      .select("recipe_slug")
      .eq("user_id", userId);

    if (data && data.length > 0) {
      const slugs = data.map((d) => d.recipe_slug);
      const query = groq`*[_type == "recipe" && slug.current in $slugs]{
        _id, name_english, name_telugu, slug, meal_type, diet, region,
        spice_level, is_healthy, cook_time_minutes, hero_image
      }`;
      const recipes = await sanityClient.fetch(query, { slugs });
      setRecipes(recipes);
    } else {
      setRecipes([]);
    }
    setLoading(false);
  }

  if (!isLoggedIn) return null;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-tamarind-500">
        My Book / నా పుస్తకం
      </h1>

      <div className="flex gap-2">
        {(["favorites", "made"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-turmeric-500 text-white"
                : "border border-brass-200 bg-white text-tamarind-400"
            }`}
          >
            {t === "favorites" ? "❤️ Saved" : "🍳 I Made This"}
          </button>
        ))}
      </div>

      <div className="kolam-divider" />

      {loading ? (
        <p className="py-8 text-center text-brass-400">Loading...</p>
      ) : (
        <RecipeGrid recipes={recipes} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build Profile page**

Create `app/profile/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { REGION_LABELS } from "@/lib/constants";
import type { Profile } from "@/lib/supabase/types";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data as Profile);
            setUsername(data.username);
            setBio(data.bio || "");
            setRegion(data.region || "");
          }
        });
    });
  }, []);

  async function handleSave() {
    if (!profile) return;
    await supabase
      .from("profiles")
      .update({ username, bio, region })
      .eq("id", profile.id);
    setProfile({ ...profile, username, bio, region });
    setEditing(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-4">
      <h1 className="font-heading text-2xl text-tamarind-500">Profile</h1>

      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 focus:border-turmeric-400 focus:outline-none"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 focus:border-turmeric-400 focus:outline-none"
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500"
          >
            <option value="">Select your region</option>
            {Object.entries(REGION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border border-brass-200 px-4 py-2 text-sm text-tamarind-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-lg font-medium text-tamarind-500">
            {profile.username}
          </p>
          {profile.region && (
            <p className="text-sm text-brass-400">
              {REGION_LABELS[profile.region] || profile.region}
            </p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm text-tamarind-400">{profile.bio}</p>
          )}
          <button
            onClick={() => setEditing(true)}
            className="mt-3 text-sm text-curry-red-500 hover:underline"
          >
            Edit Profile
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full rounded-lg border border-curry-red-200 py-2 text-sm text-curry-red-500 transition-colors hover:bg-curry-red-50"
      >
        Logout
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/my-book/ app/profile/
git commit -m "feat: add My Book (favorites/made-this) and Profile pages"
```

---

### Task 16: Community Submissions + Admin Review

**Files:**
- Create: `app/submit/page.tsx`, `app/api/submissions/route.ts`, `app/admin/submissions/page.tsx`

- [ ] **Step 1: Create submissions API route**

Create `app/api/submissions/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if admin — return all pending; otherwise return user's own
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("community_submissions")
    .select("*, profiles(username)")
    .order("submitted_at", { ascending: false });

  if (profile?.is_admin) {
    query = query.eq("status", "pending");
  } else {
    query = query.eq("submitted_by", user.id);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("community_submissions")
    .insert({
      ...body,
      submitted_by: user.id,
      attribution: body.attribution || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status, admin_notes } = await request.json();

  const { data, error } = await supabase
    .from("community_submissions")
    .update({ status, admin_notes })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 2: Build Submit Recipe page**

Create `app/submit/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { MEAL_TYPE_LABELS, REGION_LABELS, SPICE_LEVELS, DIFFICULTY_LABELS } from "@/lib/constants";

export default function SubmitPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name_english: "",
    name_telugu: "",
    meal_type: [] as string[],
    diet: "veg",
    region: "",
    spice_level: "",
    is_healthy: false,
    difficulty: "",
    cook_time_minutes: "",
    ingredients: "",
    instructions: "",
    cultural_story: "",
    tips: "",
    youtube_url: "",
    attribution: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setIsLoggedIn(true);
    });
  }, []);

  function toggleMealType(type: string) {
    setForm((f) => ({
      ...f,
      meal_type: f.meal_type.includes(type)
        ? f.meal_type.filter((t) => t !== type)
        : [...f.meal_type, type],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      cook_time_minutes: form.cook_time_minutes ? parseInt(form.cook_time_minutes) : null,
      ingredients: form.ingredients
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [qty, ...rest] = line.split(" - ");
          return { quantity: qty?.trim(), name_english: rest.join(" - ").trim(), name_telugu: "" };
        }),
      instructions: form.instructions.split("\n").filter(Boolean),
    };

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccess(true);
    }
    setSubmitting(false);
  }

  if (!isLoggedIn) return null;

  if (success) {
    return (
      <div className="py-12 text-center">
        <h2 className="font-heading text-2xl text-tamarind-500">Thank you!</h2>
        <p className="mt-2 text-brass-400">
          Your recipe has been submitted for review. We'll notify you once it's approved.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-turmeric-500 px-6 py-2 text-sm font-medium text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-8">
      <h1 className="font-heading text-2xl text-tamarind-500">
        Submit a Recipe / వంటకం పంపండి
      </h1>
      <p className="text-sm text-brass-400">
        Share your family recipe with the community. It will be reviewed before publishing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Recipe name (English) *"
          value={form.name_english}
          onChange={(e) => setForm({ ...form, name_english: e.target.value })}
          required
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:border-turmeric-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Recipe name (Telugu)"
          value={form.name_telugu}
          onChange={(e) => setForm({ ...form, name_telugu: e.target.value })}
          className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:border-turmeric-400 focus:outline-none"
        />

        {/* Meal type multi-select */}
        <div>
          <label className="text-xs font-semibold uppercase text-brass-500">Meal Type *</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleMealType(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  form.meal_type.includes(value)
                    ? "bg-turmeric-500 text-white"
                    : "border border-brass-200 text-tamarind-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Diet */}
        <div className="flex gap-3">
          {["veg", "nonveg"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm({ ...form, diet: d })}
              className={`rounded-full px-4 py-2 text-sm ${
                form.diet === d ? "bg-turmeric-500 text-white" : "border border-brass-200 text-tamarind-400"
              }`}
            >
              {d === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
            </button>
          ))}
        </div>

        {/* Region & Spice & Difficulty */}
        <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Region</option>
          {Object.entries(REGION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <select value={form.spice_level} onChange={(e) => setForm({ ...form, spice_level: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Spice Level</option>
          {Object.entries(SPICE_LEVELS).map(([v, { label, emoji }]) => <option key={v} value={v}>{emoji} {label}</option>)}
        </select>

        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Difficulty</option>
          {Object.entries(DIFFICULTY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <input type="number" placeholder="Cook time (minutes)" value={form.cook_time_minutes} onChange={(e) => setForm({ ...form, cook_time_minutes: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <label className="flex items-center gap-2 text-sm text-tamarind-400">
          <input type="checkbox" checked={form.is_healthy} onChange={(e) => setForm({ ...form, is_healthy: e.target.checked })} /> 🌿 Healthy recipe
        </label>

        <textarea placeholder="Ingredients (one per line, format: quantity - name)" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows={6} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <textarea placeholder="Instructions (one step per line)" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={6} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <textarea placeholder="Cultural story (optional — origin, tradition, family context)" value={form.cultural_story} onChange={(e) => setForm({ ...form, cultural_story: e.target.value })} rows={4} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <textarea placeholder="Tips & variations (optional)" value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} rows={2} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <input type="url" placeholder="YouTube URL (optional)" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <input type="text" placeholder="Attribution (e.g., 'From my grandmother in Nellore')" value={form.attribution} onChange={(e) => setForm({ ...form, attribution: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />

        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Build Admin Submissions page**

Create `app/admin/submissions/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { REGION_LABELS, SPICE_LEVELS } from "@/lib/constants";
import type { CommunitySubmission } from "@/lib/supabase/types";

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        router.push("/");
        return;
      }

      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  async function handleAction(id: string, status: "approved" | "rejected") {
    const res = await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-brass-400">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-tamarind-500">
        Admin — Review Submissions
      </h1>
      <p className="text-sm text-brass-400">
        {submissions.length} pending submission{submissions.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg text-tamarind-500">
                  {sub.name_english}
                  {sub.name_telugu && (
                    <span className="ml-2 font-telugu text-base text-brass-500">
                      ({sub.name_telugu})
                    </span>
                  )}
                </h3>
                <p className="text-xs text-brass-400">
                  {sub.meal_type.join(", ")} · {sub.diet} ·{" "}
                  {REGION_LABELS[sub.region || ""] || sub.region} ·{" "}
                  {SPICE_LEVELS[sub.spice_level || ""]?.emoji || ""}
                </p>
                {sub.attribution && (
                  <p className="mt-1 text-xs italic text-brass-500">
                    "{sub.attribution}"
                  </p>
                )}
              </div>
            </div>

            {sub.cultural_story && (
              <p className="mt-2 text-sm text-tamarind-400 line-clamp-3">
                {sub.cultural_story}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAction(sub.id, "approved")}
                className="rounded-lg bg-curry-leaf-500 px-4 py-1.5 text-sm font-medium text-white"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(sub.id, "rejected")}
                className="rounded-lg border border-curry-red-200 px-4 py-1.5 text-sm text-curry-red-500"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {submissions.length === 0 && (
          <p className="py-8 text-center text-brass-400">
            No pending submissions
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/submit/ app/api/submissions/ app/admin/
git commit -m "feat: add community submission flow and admin review queue"
```

---

### Task 17: Bulk Import Script & Prompt

**Files:**
- Create: `scripts/import-recipes.sh`, `scripts/IMPORT_PROMPT.md`

- [ ] **Step 1: Create the AI prompt document**

Create `scripts/IMPORT_PROMPT.md`:

````markdown
# Recipe Generation Prompt

Copy-paste this into Gemini or ChatGPT to generate the bulk recipe data.

---

You are an expert on Andhra Pradesh cuisine with deep knowledge of regional food traditions across Coastal Andhra, Rayalaseema, North Andhra, and the Godavari region.

Generate authentic Andhra Pradesh recipes in NDJSON format (one JSON object per line, NO wrapping array, NO trailing commas).

Each recipe must be a valid JSON object with this exact structure:

```json
{"_type":"recipe","name_english":"Pesarattu","name_telugu":"పెసరట్టు","slug":{"_type":"slug","current":"pesarattu"},"meal_type":["breakfast"],"diet":"veg","region":"coastal-andhra","spice_level":"medium","is_healthy":true,"occasion":["everyday"],"difficulty":"easy","cook_time_minutes":20,"ingredients":[{"name_english":"Green Moong Dal","name_telugu":"పెసలు","quantity":"1 cup"},{"name_english":"Green Chillies","name_telugu":"పచ్చి మిర్చి","quantity":"2-3"},{"name_english":"Ginger","name_telugu":"అల్లం","quantity":"1 inch piece"},{"name_english":"Cumin Seeds","name_telugu":"జీలకర్ర","quantity":"1/2 tsp"},{"name_english":"Salt","name_telugu":"ఉప్పు","quantity":"to taste"}],"instructions":[{"_type":"block","_key":"inst1","children":[{"_type":"span","_key":"s1","text":"Soak moong dal for 4-6 hours. Drain and grind with green chillies, ginger, cumin, and salt into a smooth batter, adding minimal water."}],"markDefs":[],"style":"normal"},{"_type":"block","_key":"inst2","children":[{"_type":"span","_key":"s2","text":"Heat a cast iron tawa (బండ పెనం). Pour a ladle of batter and spread thin like a dosa. Drizzle oil around the edges."}],"markDefs":[],"style":"normal"},{"_type":"block","_key":"inst3","children":[{"_type":"span","_key":"s3","text":"Cook until the bottom is golden and crispy. Fold and serve hot with Allam Pachadi (ginger chutney) and Upma."}],"markDefs":[],"style":"normal"}],"cultural_story":[{"_type":"block","_key":"cs1","children":[{"_type":"span","_key":"cs1s","text":"Pesarattu is the crown jewel of Andhra breakfast — a protein-rich crepe made from whole green moong dal. It originated in the Coastal Andhra region and is a staple in cities like Vijayawada, Guntur, and Machilipatnam."}],"markDefs":[],"style":"normal"},{"_type":"block","_key":"cs2","children":[{"_type":"span","_key":"cs2s","text":"The most famous variant is 'MLA Pesarattu' — stuffed with spicy upma — named after a hotel near the Andhra Pradesh Legislative Assembly in Hyderabad where it was popularized. In traditional Andhra homes, Pesarattu is made on cast iron pans for the perfect crisp."}],"markDefs":[],"style":"normal"}],"tips":[{"_type":"block","_key":"t1","children":[{"_type":"span","_key":"t1s","text":"For extra crispiness, add a tablespoon of rice while grinding. In Guntur, extra green chillies are added for heat. For MLA Pesarattu, spread upma on the pesarattu before folding."}],"markDefs":[],"style":"normal"}],"youtube_url":"","featured":false}
```

IMPORTANT RULES:
1. Output ONLY valid NDJSON — one complete JSON object per line
2. `slug.current` must be lowercase kebab-case of `name_english`
3. `meal_type` is an array — tag most pappu/kura/pulusu dishes as `["lunch","dinner"]`. Tag heavy rice feasts as `["lunch"]` only. Tag lighter dishes as `["dinner"]` only.
4. `diet` must be exactly `"veg"` or `"nonveg"`
5. `region` must be one of: `"coastal-andhra"`, `"rayalaseema"`, `"north-andhra"`, `"godavari"`
6. `spice_level` must be one of: `"mild"`, `"medium"`, `"spicy"`, `"extra-spicy"`, `"kramp"`. Omit for sweets.
7. `instructions` and `cultural_story` and `tips` must use Sanity Portable Text block format as shown above. Each step/paragraph is a separate block with unique `_key` values.
8. `_key` values must be unique within each array — use patterns like `inst1`, `inst2`, `cs1`, `cs2`, `t1` etc.
9. Generate 100+ recipes covering: breakfast (15+), lunch (25+), dinner (20+), snacks (15+), sweets (10+)
10. Include both veg and nonveg across all categories
11. Cover ALL FOUR regions — don't concentrate on one
12. `cultural_story` must be 2-3 paragraphs of authentic, specific cultural context — not generic food blog filler
13. Telugu names and ingredient names must be accurate
14. Mark genuinely healthy dishes (millet-based, low oil, no maida) as `"is_healthy": true`
````

- [ ] **Step 2: Create import script**

Create `scripts/import-recipes.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Usage: ./scripts/import-recipes.sh path/to/recipes.ndjson

FILE="${1:?Usage: ./scripts/import-recipes.sh <recipes.ndjson>}"

if [ ! -f "$FILE" ]; then
  echo "Error: File not found: $FILE"
  exit 1
fi

LINES=$(wc -l < "$FILE" | tr -d ' ')
echo "Importing $LINES recipes from $FILE..."

# Validate JSON
echo "Validating JSON..."
while IFS= read -r line; do
  echo "$line" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null || {
    echo "Invalid JSON line: $line"
    exit 1
  }
done < "$FILE"
echo "All lines valid."

# Import to Sanity
echo "Importing to Sanity..."
npx sanity dataset import "$FILE" production
echo "Done! $LINES recipes imported."
echo ""
echo "Next steps:"
echo "1. Visit your Sanity Studio to review imported recipes"
echo "2. Add hero images for featured recipes"
echo "3. Add YouTube URLs using the youtube_search_query hints"
```

- [ ] **Step 3: Make script executable**

```bash
chmod +x scripts/import-recipes.sh
```

- [ ] **Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add bulk import script and AI prompt for recipe generation"
```

---

### Task 18: Deployment to Vercel

**Files:**
- Create: `.gitignore` updates

- [ ] **Step 1: Ensure .gitignore is correct**

Verify `.gitignore` includes:

```
.env.local
.env*.local
node_modules/
.next/
.superpowers/
```

- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

- [ ] **Step 3: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com), import the GitHub repo
2. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2026-04-17`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_BASE_URL` = your Vercel domain
3. Deploy

- [ ] **Step 4: Update Supabase redirect URLs**

In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to your Vercel domain
- Add `https://your-domain.vercel.app/auth/callback` to Redirect URLs

- [ ] **Step 5: Import recipes**

1. Generate recipes using the prompt in `scripts/IMPORT_PROMPT.md`
2. Save output as `recipes.ndjson`
3. Run: `./scripts/import-recipes.sh recipes.ndjson`

- [ ] **Step 6: Set yourself as admin**

In Supabase Table Editor → `profiles` → find your user row → set `is_admin` to `true`

- [ ] **Step 7: Verify production**

Visit your Vercel domain and verify:
- Home page loads with recipe grid
- Browse page filters work
- Recipe detail pages have share buttons
- Auth flow works (register → login)
- Community features work (rate, review, favorite, "I made this")
- WhatsApp share sends correct message
- OG images render when pasting links

- [ ] **Step 8: Commit any final fixes**

```bash
git add -A
git commit -m "chore: deployment config and final adjustments"
git push
```
