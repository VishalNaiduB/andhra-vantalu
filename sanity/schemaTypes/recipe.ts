import { defineType, defineField, defineArrayMember } from "sanity";

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({
      name: "name_english",
      title: "Recipe Name (English)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name_telugu",
      title: "Recipe Name (Telugu)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name_english",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "meal_type",
      title: "Meal Type",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Breakfast", value: "breakfast" },
              { title: "Lunch", value: "lunch" },
              { title: "Dinner", value: "dinner" },
              { title: "Snacks", value: "snacks" },
              { title: "Sweets", value: "sweets" },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "diet",
      title: "Diet",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Vegetarian", value: "veg" },
          { title: "Non-Vegetarian", value: "nonveg" },
        ],
      },
      validation: (rule) => rule.required(),
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
          { title: "Godavari", value: "godavari" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spice_level",
      title: "Spice Level",
      type: "string",
      options: {
        list: [
          { title: "🌶 Mild", value: "mild" },
          { title: "🌶 🌶 Medium", value: "medium" },
          { title: "🌶 🌶 🌶 Spicy", value: "spicy" },
          { title: "🌶 🌶 🌶 🌶 Extra Spicy", value: "extra-spicy" },
          { title: "🔥 Kramp", value: "kramp" },
        ],
      },
      hidden: ({ parent }) => {
        const mealTypes = parent?.meal_type || [];
        return mealTypes.includes("sweets");
      },
    }),
    defineField({
      name: "is_healthy",
      title: "Is Healthy",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "occasion",
      title: "Occasion",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Everyday", value: "everyday" },
              { title: "Festival", value: "festival" },
              { title: "Wedding", value: "wedding" },
              { title: "Fasting", value: "fasting" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Medium", value: "medium" },
          { title: "Traditional", value: "traditional" },
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
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name_english",
              title: "Name (English)",
              type: "string",
            }),
            defineField({
              name: "name_telugu",
              title: "Name (Telugu)",
              type: "string",
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
    }),
    defineField({
      name: "cultural_story",
      title: "Cultural Story",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
    }),
    defineField({
      name: "tips",
      title: "Tips",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
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
      of: [defineArrayMember({ type: "image" })],
    }),
    defineField({
      name: "related_recipes",
      title: "Related Recipes",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "recipe" },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
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
