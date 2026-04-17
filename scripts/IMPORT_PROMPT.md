# Bulk Recipe Import Prompt for Andhra Vantalu

Copy-paste this prompt into Claude, Gemini, or ChatGPT to generate 100+ authentic Andhra Pradesh recipes for bulk import.

---

## AI Generation Prompt

You are an expert on Andhra Pradesh cuisine. Generate exactly **100+ authentic Andhra Pradesh recipes** in **NDJSON format** (one valid JSON object per line, no array wrapper, no markdown code blocks).

### JSON Structure

Each recipe MUST follow this exact structure:

```json
{
  "_type": "recipe",
  "name_english": "Pesarattu",
  "name_telugu": "పెసరట్టు",
  "slug": {
    "_type": "slug",
    "current": "pesarattu"
  },
  "meal_type": ["breakfast"],
  "diet": "veg",
  "region": "coastal-andhra",
  "spice_level": "mild",
  "is_healthy": true,
  "occasion": ["everyday", "festival"],
  "difficulty": "easy",
  "cook_time_minutes": 25,
  "ingredients": [
    {
      "name_english": "mung beans",
      "name_telugu": "పచ్చలో",
      "quantity": "1 cup"
    },
    {
      "name_english": "onions",
      "name_telugu": "ఉల్లిపాయలు",
      "quantity": "2 medium"
    },
    {
      "name_english": "green chillies",
      "name_telugu": "ఆకుపచ్చ మిర్చిలు",
      "quantity": "2"
    },
    {
      "name_english": "ginger",
      "name_telugu": "అల్లం",
      "quantity": "1 tablespoon"
    },
    {
      "name_english": "salt",
      "name_telugu": "ఉప్పు",
      "quantity": "to taste"
    },
    {
      "name_english": "oil",
      "name_telugu": "నూనె",
      "quantity": "for frying"
    }
  ],
  "instructions": [
    {
      "_type": "block",
      "_key": "key1abc",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "child1a",
          "text": "Soak mung beans overnight in water.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "key2def",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "child2b",
          "text": "Drain and grind with ginger, green chillies, and onions into a thick batter.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "key3ghi",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "child3c",
          "text": "Add salt to taste.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "key4jkl",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "child4d",
          "text": "Heat oil in a flat pan and spread the batter thin.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "key5mno",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "child5e",
          "text": "Fry until golden brown on both sides.",
          "marks": []
        }
      ],
      "markDefs": []
    }
  ],
  "cultural_story": [
    {
      "_type": "block",
      "_key": "story1pqr",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "storyChild1",
          "text": "Pesarattu is the soul of Andhra breakfast culture, dating back centuries to the kingdoms of Coastal Andhra. The word itself comes from 'pesara' (mung beans) in Telugu, and this humble dosa-like crepe has graced the tables of farmers before dawn, giving them energy for the fields. In farming communities of Godavari and Krishna delta regions, pesarattu was traditionally made with freshly ground mung bean batter, often paired with ginger and chillies to wake the body.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "story2stu",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "storyChild2",
          "text": "What makes Andhra pesarattu unique compared to other Indian crepes is the absence of fermentation and the distinct emphasis on ginger's bite and chilli heat, even in this light breakfast dish. Families often prepare it fresh each morning, with the sound of grinding stones becoming a familiar wake-up call in villages. The recipe reflects the coastal region's access to abundant mung bean crops and the Andhra philosophy of food that nourishes both body and soul.",
          "marks": []
        }
      ],
      "markDefs": []
    }
  ],
  "tips": [
    {
      "_type": "block",
      "_key": "tip1vwx",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "tipChild1",
          "text": "The batter should be thick but spreadable—thinner than idli batter but thicker than dosa.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "tip2yza",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "tipChild2",
          "text": "Serve immediately with ginger chutney or tomato pickle for authentic taste.",
          "marks": []
        }
      ],
      "markDefs": []
    },
    {
      "_type": "block",
      "_key": "tip3bcd",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "_key": "tipChild3",
          "text": "Some families add a pinch of turmeric to the batter for color and digestion benefits.",
          "marks": []
        }
      ],
      "markDefs": []
    }
  ],
  "youtube_url": "",
  "featured": false
}
```

---

### CRITICAL RULES

1. **Output Format**: ONLY NDJSON (one JSON per line). Do NOT use markdown code blocks, do NOT wrap in an array, do NOT add explanatory text.

2. **slug.current**: MUST be lowercase kebab-case version of name_english. Examples:
   - "Pesarattu" → "pesarattu"
   - "Gongura Mutton" → "gongura-mutton"
   - "Hyderabadi Biryani" → "hyderabadi-biryani"

3. **Portable Text Blocks** (instructions, cultural_story, tips):
   - Each block MUST have:
     - `_type: "block"`
     - Unique `_key` (e.g., "key1abc", "key2def"—different for each block)
     - `style: "normal"` (or other valid styles)
     - `children` array with at least one span
   - Each span MUST have:
     - `_type: "span"`
     - Unique `_key` (different from block _key)
     - `text`: the actual content
     - `marks: []` (or formatting marks if needed)
   - `markDefs: []` for the block unless using marks like bold/italic

4. **meal_type** (multi-select array):
   - Heavy dishes (biryanis, meat curries, rich gravies): `["lunch"]` or `["lunch","dinner"]`
   - Light dishes (pesarattu, dosa, appams): `["breakfast"]`
   - Medium dishes: `["lunch","dinner"]`
   - Snacks: `["snacks"]`
   - Desserts: `["sweets"]`

5. **Region Coverage** (all 4 regions):
   - `coastal-andhra`: Pesarattu, Gongura, Prawns, Pomfret, Rice dishes
   - `rayalaseema`: Gongura Curry, Senaga Pappu, Tamarind-based dishes
   - `north-andhra`: Biryani variants, Pulao, Heavy gravies
   - `godavari`: Andhra Pappu, Rice-based dishes, Light curries

6. **Category Coverage**:
   - **Breakfast (15+)**: Pesarattu, Dosa variants, Appam, Idiots, Upma, Puri, Chutney dishes
   - **Lunch (25+)**: Biryani, Curries, Pappu dishes, Meat preparations, Vegetable curries
   - **Dinner (20+)**: Light curries, Soups, Rice dishes, Breads, Salads
   - **Snacks (15+)**: Pakora, Chikhalwali, Murukku, Chikali, Puri, Mixture
   - **Sweets (10+)**: Jaggery-based, Payasam, Laddu, Halwa, Puran Puri

7. **Diet Balance**:
   - Include both vegetarian (`"veg"`) and non-vegetarian (`"nonveg"`)
   - Meat types: mutton, chicken, fish, prawns, crab (authentic to Andhra)

8. **Spice Levels** (omit for sweets):
   - `"mild"`: Light dishes, some yogurt-based
   - `"medium"`: Most curries, everyday dishes
   - `"spicy"`: Gongura, Andhra classics, meat dishes
   - `"extra-spicy"`: Fire-hot curries, specialized regional dishes
   - `"kramp"`: Extreme heat dishes (use sparingly, 2-3 only)

9. **Authentic Details**:
   - **Telugu names** MUST be accurate (use proper Telugu script ఆ, ఈ, ఉ, etc.)
   - **Cultural stories** must be specific, NOT generic. Include:
     - Historical/regional origin
     - Family tradition or seasonal significance
     - Connection to festivals, farming, or geography
   - **Ingredients** must use authentic Andhra spices and items

10. **Unique _key Values**: Every block and span across all recipes must have unique _key values. Use patterns like:
    - Recipe 1: key1a, key1b, key1c...
    - Recipe 2: key2a, key2b, key2c...
    - etc.

---

### Coverage Requirements

- **Total**: 100+ recipes
- **Regions**: Minimum 20 from each region
- **Meal Types**: 15+ breakfast, 25+ lunch, 20+ dinner, 15+ snacks, 10+ sweets
- **Diet**: Mix of veg and nonveg
- **Difficulty**: Mix of easy, medium, traditional
- **cook_time_minutes**: Vary from 10 to 180 (must be realistic)
- **occasions**: Use relevant occasion tags (everyday, festival, wedding, fasting)
- **is_healthy**: Mark appropriate dishes as true

---

### Quality Checklist

Before sending output:
- Every recipe has all required fields
- No markdown, no code blocks, no arrays wrapper
- Each line is valid JSON
- All Telugu text is correct
- All slug.current values are kebab-case
- meal_type arrays have appropriate values
- cultural_story has 2-3 authentic paragraphs
- All Portable Text blocks have unique _keys
- No duplicate recipe names
- Spice_level omitted for sweets

---

## Output Format

Paste the raw NDJSON output directly below. One recipe per line.
