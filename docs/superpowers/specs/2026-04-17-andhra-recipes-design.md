# Andhra Pradesh Recipe Website — Design Spec
**Date:** 2026-04-17  
**Status:** Approved

---

## Overview

A mobile-first recipe website dedicated to authentic Andhra Pradesh cuisine, serving Telugu-speaking users (diaspora and locals). The site combines three layers:
1. **Cookbook** — find and follow recipes
2. **Community platform** — submit, rate, and discuss recipes
3. **Cultural archive** — stories, regional origins, and heritage behind each dish

The visual ethos is **nostalgic, classy, and village-rooted** — like a grandmother's recipe book meeting a modern mobile app. Every design decision should feel made by someone who grew up eating this food.

---

## Audience

Primary: Telugu-speaking Andhra people (diaspora + locals) seeking authentic home recipes.  
Secondary: Food enthusiasts curious about Andhra cuisine.  
Browsing is open to all — no account required. Login is only needed to rate, review, submit recipes, or save favorites.

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Frontend | Next.js (React) | Mobile-first UI, static generation for speed |
| Headless CMS | Sanity | Admin recipe editing, cultural content management |
| Backend / Auth | Supabase | User accounts, ratings, reviews, submissions, image storage |
| Deployment | Vercel | Hosting (free tier to start) |
| Language | TypeScript | Type safety across frontend + API |

**Cost to launch: $0** — all free tiers are sufficient for early traffic.

---

## Architecture

```
User's Browser (Mobile-first)
        │
   Next.js App (Vercel)
   ├── Public pages: browse, search, filter, cultural stories
   ├── Auth pages: login, register, profile
   └── Admin pages: submission review dashboard (protected)
        │
   ┌────┴──────────────────────────────┐
   │                                   │
Sanity CMS                          Supabase
(curated editorial content)         (community layer)
├── Recipes (schema-structured)     ├── User accounts & profiles
├── Cultural stories                ├── Ratings & reviews
├── Regional tags                   ├── Community recipe submissions
├── Ingredient glossary             ├── Favorites / saved recipes
└── YouTube video references        ├── "I made this" counts
                                    └── Community photo storage
```

**Data flow:**
- Sanity-managed recipes → statically generated at build time → fast on mobile
- Community data (ratings, reviews, "I made this") → fetched live from Supabase client-side
- Community submissions → saved to Supabase → admin reviews → approved entries manually added to Sanity

---

## Content Structure

### Recipe Schema (Sanity)

| Field | Type | Notes |
|---|---|---|
| `name_english` | string | e.g., "Pesarattu" |
| `name_telugu` | string | e.g., "పెసరట్టు" |
| `meal_type` | enum | Breakfast / Lunch / Snacks / Dinner / Sweets & Desserts |
| `diet` | enum | Veg / Non-Veg |
| `region` | enum | Coastal Andhra / Rayalaseema / North Andhra / Godavari Region |
| `spice_level` | enum | Mild / Medium / Spicy / Extra Spicy / Kramp (not shown for Sweets) |
| `is_healthy` | boolean | Low oil, no maida, no refined sugar, millets-based, etc. |
| `occasion` | array | Everyday / Festival / Wedding / Fasting |
| `difficulty` | enum | Easy / Medium / Traditional (requires skill) |
| `ingredients` | array | Each with English name, Telugu name, quantity |
| `instructions` | rich text | Step-by-step |
| `cultural_story` | rich text | Origin, regional significance, family/festival context |
| `tips` | rich text | Regional variations, substitutions |
| `youtube_url` | url | Optional — key recipes only |
| `hero_image` | image | Sanity-managed, auto-optimized |
| `step_images` | image array | Optional step-by-step photos |
| `related_recipes` | reference array | Links to other recipes |

### Spice Levels
- 🌶 Mild
- 🌶🌶 Medium
- 🌶🌶🌶 Spicy
- 🌶🌶🌶🌶 Extra Spicy
- 🌶🌶🌶🌶🌶 Kramp *(Andhra-level — you've been warned)*

Spice level is not shown for Sweets & Desserts category.

### Healthy Tag
Recipes marked `is_healthy: true` get a green leaf badge on cards and appear in a dedicated "Healthy Andhra" section. Criteria: low oil, no maida, no refined sugar, high protein, millets-based, or minimal processing.

### Starter Content — Example Recipes by Category

| Meal | Veg | Non-Veg |
|---|---|---|
| Breakfast | Pesarattu, Upma, Punugulu, Idli, Dosa, Attu, Ragi Sankati | Kheema Dosa, Egg Pesarattu |
| Lunch | Gongura Pappu, Pulihora, Bagara Rice, Sambar, Gutti Vankaya | Gongura Mutton, Royyala Iguru, Chicken Pulusu |
| Snacks | Chegodilu, Murukku, Jantikalu, Ariselu | Kodi Pakodi, Fish Bajji |
| Dinner | Pesara Pappu, Dosakaya Pappu, Tomato Pappu | Natu Kodi Pulusu, Chepala Pulusu |
| Sweets | Pootharekulu, Ariselu, Bobbatlu, Paramannam | — |

### Community Submission Schema (Supabase)

Same fields as above, plus:
- `submitted_by` — user ID
- `status` — Pending / Approved / Rejected
- `attribution` — "Recipe by [username], from [village/town]"
- `submitted_at` — timestamp

Community submissions appear publicly only after admin approval. On approval, admin creates the full Sanity entry and attributes the contributor.

---

## Pages & Navigation

### Mobile Navigation (Bottom Tab Bar)
```
🏠 Home  |  🔍 Browse  |  📖 My Book  |  👤 Profile
```
"My Book" and "Profile" tabs are accessible to all but prompt login when interacting with saved/personal features.

### Page List

**Home**
- Rotating hero: featured recipe + cultural quote in Telugu
- Quick filter pills: Breakfast / Lunch / Snacks / Dinner / Healthy
- "Today's Special" — curated daily pick
- Regional spotlight (e.g., "This week: Rayalaseema")
- Community picks — highest rated this week

**Browse / Search**
- Full filter panel: Meal Type · Veg/Non-Veg · Region · Spice Level · Occasion · Healthy · Difficulty
- Recipe cards: photo, Telugu+English name, spice icons, rating, cook time, veg/non-veg dot
- Search with Telugu keyword support

**Recipe Detail**
- Hero photo + YouTube embed (loads on tap only — saves mobile data)
- Telugu name prominent, English below
- All tags displayed (region, spice, diet, occasion, healthy badge)
- Ingredients with Telugu glossary tooltips
- Step-by-step instructions
- Cultural story / origin note (parchment-feel section)
- "I made this" button + count (login required)
- Star rating + reviews (login required to submit)
- Related recipes

**Cultural Archive**
- Standalone section: stories about dishes, festival food traditions, regional ingredients, historical origins
- Linked bidirectionally from recipe pages

**My Book** (login required to use)
- Saved/favorited recipes
- "I made this" history
- Submitted recipes + their approval status

**Profile**
- Username, bio, region they're from
- Their recipe submissions and contributions

**Admin Dashboard** (protected route)
- Sanity Studio embedded — add/edit curated recipes with rich editor
- Community submission review queue: approve / reject / request changes

---

## Visual Design

### North Star
**Nostalgic, classy, village-rooted.** Every screen should feel like it was designed by someone who grew up eating this food — not a startup that discovered Andhra cuisine.

### Color Palette
- Primary: Deep turmeric yellow
- Accent: Tamarind brown, curry red
- Supporting: Curry leaf green
- Background: Warm off-white / aged cream
- Metallic accents: Brass / copper tones (traditional Andhra bronze vessel inspired)

### Typography
- Headings: Elegant serif with character — nostalgic, weighted
- Body: Clean readable sans-serif — usable on mobile
- Telugu names: Slightly decorative, prominent — signals authenticity even to English readers

### Texture & Atmosphere
- Subtle background textures: aged paper, jute, raw terracotta
- Cultural story sections: parchment-feel background — visually distinct from recipe content
- Section dividers: Kolam/Rangoli-inspired patterns
- Archive/cultural photos: black & white or sepia tone
- Aged handwritten-style labels for section headers
- Brass/copper icon accents

### Recipe Cards
- Large food photography dominant
- Telugu name styled prominently above English
- Spice chilli icons immediately visible
- Green leaf badge for Healthy recipes
- Standard Indian green dot (veg) / red dot (non-veg)

### Guiding Principle
Every design element should reinforce the feeling: *"This is from home."*

---

## Filters (Full Set)

Available on Browse page and as quick pills throughout:
- **Meal Type:** Breakfast / Lunch / Snacks / Dinner / Sweets & Desserts
- **Diet:** Veg / Non-Veg
- **Region:** Coastal Andhra / Rayalaseema / North Andhra / Godavari Region
- **Spice Level:** Mild / Medium / Spicy / Extra Spicy / Kramp
- **Occasion:** Everyday / Festival / Wedding / Fasting
- **Healthy:** Yes / No
- **Difficulty:** Easy / Medium / Traditional

---

## Authentication

- Provider: Supabase Auth
- Methods: Email/password + Google OAuth
- Guest browsing: fully open — no popups, no prompts
- Login required only for: ratings, reviews, recipe submission, favorites, "I made this"

---

## Bulk Content Import (Launch Strategy)

To seed 80-90% of widely-known Andhra dishes on day one:

1. **Schema is locked** when the site is built (Sanity schema defined in code)
2. **Generate content** using Gemini/ChatGPT with this prompt:

```
You are an expert on Andhra Pradesh cuisine. Generate a complete list of authentic 
Andhra dishes in the following JSON format (NDJSON — one JSON object per line, 
no wrapping array).

For each recipe include:
{
  "_type": "recipe",
  "name_english": "",
  "name_telugu": "",
  "meal_type": "breakfast|lunch|snacks|dinner|sweets",
  "diet": "veg|nonveg",
  "region": "coastal-andhra|rayalaseema|north-andhra|godavari",
  "spice_level": "mild|medium|spicy|extra-spicy|kramp",
  "is_healthy": true|false,
  "occasion": ["everyday|festival|wedding|fasting"],
  "difficulty": "easy|medium|traditional",
  "ingredients": [{"name_english": "", "name_telugu": "", "quantity": ""}],
  "instructions": ["step 1", "step 2"],
  "cultural_story": "2-3 paragraphs about origin, regional significance, family/festival context",
  "tips": "regional variations and substitutions",
  "youtube_search_query": "search query to find a good YouTube video for this recipe"
}

Cover all major categories: breakfast, lunch, snacks, dinner, sweets. 
Include both veg and non-veg. Cover all four regions. 
Include at least 80-90 recipes covering widely known Andhra dishes.
Ensure cultural_story is rich, authentic, and specific — not generic food blog content.
```

3. **Import in one command:**
```bash
sanity dataset import recipes.ndjson production
```

4. **Add YouTube links** — use the `youtube_search_query` field to find and add real video URLs in Sanity Studio post-import.

---

## Performance Targets

- Recipe pages: statically generated → loads in <1s on 4G
- Images: lazy-loaded, Sanity auto-optimizes
- YouTube embeds: load on tap only (not auto-loaded)
- Community data: client-side fetch, non-blocking

---

## Launch Checklist

- [ ] Next.js project scaffolded
- [ ] Sanity schema defined and Studio running
- [ ] Supabase project created, auth configured
- [ ] Core pages built (Home, Browse, Recipe Detail)
- [ ] Recipe cards with all badges (spice, veg/non-veg, healthy)
- [ ] Filter system working
- [ ] Auth flow (login/register, guest browsing)
- [ ] Community features (ratings, reviews, "I made this", favorites)
- [ ] Community submission flow + admin review queue
- [ ] Cultural Archive section
- [ ] My Book page
- [ ] Bulk import via Sanity CLI
- [ ] Deployed to Vercel
