# Nutrition Data

Read this when working with nutrition calculations, food items, or the NUTRITION_DATA lookup.

## Data Source

Primary source is Google Sheets (food category sheets). Secondary source is the `NUTRITION_DATA` array in `lib/nutrition.ts` (used as fallback / static reference).

## FoodItem Type (lib/types.ts)

```typescript
interface FoodItem {
  name: string
  category: FoodCategory
  protein: number     // per 100g
  fat: number         // per 100g
  carbs: number       // per 100g (total carbohydrates)
  sugar: number       // per 100g (sub-category of carbs)
  fiber: number       // per 100g (sub-category of carbs)
  calories: number    // per 100g
  measureType: 'gram' | 'unit'
  unitName: string | null   // e.g. "huevo", "pieza"
  unitGrams: number | null  // e.g. 60 for an egg
  preparation: 'crudo' | 'cocido' | null
}
```

## Macro Calculation

```typescript
if (measureType === 'unit' && unitGrams) {
  factor = (amount * unitGrams) / 100
} else {
  factor = amount / 100
}

protein = food.protein * factor
fat = food.fat * factor
carbs = food.carbs * factor
sugar = food.sugar * factor
fiber = food.fiber * factor
calories = food.calories * factor
```

- `preparation`: `'crudo'` for protein, `'cocido'` for carbs, `null` for others
- Display rounding: protein/fat/carbs/sugar/fiber to 1 decimal, calories to integer

Read `docs/architecture.md` for the overall architecture.
