import { NUTRITION_DATA } from './nutrition'

export interface NutritionHint {
  nameEn: string | null
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
  measureType: 'gram' | 'unit'
  unitName: string | null
  unitGrams: number | null
  preparation: 'crudo' | 'cocido' | null
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export function lookupNutrition(name: string): NutritionHint {
  const normalized = normalizeName(name)

  for (const entry of NUTRITION_DATA) {
    if (entry.matches.some(m => normalized.includes(m))) {
      return nutritionEntryToHint(entry)
    }
  }

  return emptyNutritionHint()
}

export function lookupNutritionMatches(name: string, limit = 5) {
  const normalized = normalizeName(name)
  if (!normalized) return []

  const matches = []
  for (const entry of NUTRITION_DATA) {
    const isMatch = entry.matches.some(m => {
      const normalizedMatch = normalizeName(m)
      return normalizedMatch.includes(normalized) || normalized.includes(normalizedMatch)
    })
    if (isMatch) matches.push(entry)
  }

  return matches.slice(0, limit)
}

function nutritionEntryToHint(entry: typeof NUTRITION_DATA[number]): NutritionHint {
  return {
    nameEn: entry.nameEn ?? null,
    protein: entry.protein,
    fat: entry.fat,
    carbs: entry.carbs,
    sugar: entry.sugar ?? 0,
    fiber: entry.fiber ?? 0,
    calories: entry.calories,
    measureType: entry.measureType,
    unitName: entry.unitName ?? null,
    unitGrams: entry.unitGrams ?? null,
    preparation: entry.preparation ?? null,
  }
}

function emptyNutritionHint(): NutritionHint {
  return {
    nameEn: null,
    protein: 0,
    fat: 0,
    carbs: 0,
    sugar: 0,
    fiber: 0,
    calories: 0,
    measureType: 'gram',
    unitName: null,
    unitGrams: null,
    preparation: null,
  }
}
