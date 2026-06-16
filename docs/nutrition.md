# Nutrition Data

Read this when working with nutrition calculations, food items, or the `NUTRITION_DATA` lookup.

## Data Source

**Primary source is the static `NUTRITION_DATA` array** in `lib/nutrition.ts` (~130 entries spanning all
7 categories). It is the single source of truth for the food catalog. The seed script
(`lib/db/seed.ts`) reads from this array and inserts into PostgreSQL.

The admin form (`app/[locale]/admin/page.tsx`) also uses `lookupNutrition()` to auto-fill macro
fields when an admin types a name that matches a known entry — `nameEn` is auto-filled too.

## FoodItem Type (`lib/types.ts`)

```typescript
interface FoodItem {
  id: number
  name: string                  // Spanish name (displayed in ES locale, fallback in EN)
  nameEn: string | null         // English name (displayed in EN locale when present)
  category: FoodCategory        // 7 values, see below
  protein: number               // per 100g (or per unit_grams)
  fat: number                   // per 100g
  carbs: number                 // per 100g (total carbohydrates)
  sugar: number                 // per 100g (sub-category of carbs, default 0)
  fiber: number                 // per 100g (sub-category of carbs, default 0)
  calories: number              // per 100g (integer)
  measureType: 'gram' | 'unit'
  unitName: string | null       // e.g. "huevo", "pieza" (only when measureType = 'unit')
  unitGrams: number | null      // e.g. 60 for an egg (only when measureType = 'unit')
  preparation: 'crudo' | 'cocido' | null
}
```

## FoodCategory

```typescript
type FoodCategory =
  | 'proteina'
  | 'carbohidratos'
  | 'grasas'
  | 'frutas'
  | 'verduras'
  | 'condimentos'
  | 'suplementos'
```

`preparation` is set per category by convention: `'crudo'` for protein, `'cocido'` for carbs,
`null` for the rest.

## Macro Calculation (`lib/macros.ts`)

```typescript
const factor =
  food.measureType === 'unit' && food.unitGrams
    ? (amount * food.unitGrams) / 100
    : amount / 100

return {
  protein:  Math.round(food.protein * factor * 10) / 10,
  fat:      Math.round(food.fat * factor * 10) / 10,
  carbs:    Math.round(food.carbs * factor * 10) / 10,
  sugar:    Math.round(food.sugar * factor * 10) / 10,
  fiber:    Math.round(food.fiber * factor * 10) / 10,
  calories: Math.round(food.calories * factor),
}
```

- All macros except calories are stored rounded to 1 decimal.
- Calories are stored as integers.
- The result is **denormalized** into `log_entries` so reads are fast and historical logs are
  accurate even if a food is later updated.

## Lookup Helpers (`lib/nutrition-utils.ts`)

```typescript
normalizeName(name)
  // lowercase, strip diacritics, remove non-alphanumerics, trim
  // used for fuzzy matching of free-text input

lookupNutrition(name)
  // iterates NUTRITION_DATA, checks if any `matches` substring is contained in `name`
  // returns macro hints (or zeros) and auto-fills nameEn, measureType, unitName, unitGrams, preparation

lookupNutritionMatches(name, limit = 5)
  // returns up to `limit` NUTRITION_DATA entries whose `matches` overlap with `name`
  // used by the admin autocomplete dropdown
```

`lookupNutrition` and `lookupNutritionMatches` are used by the admin form for auto-fill
convenience — they do not auto-create foods. The admin still has to click save.

Read `docs/architecture.md` for the overall architecture.
