import { NUTRITION_DATA } from './nutrition'

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export function lookupNutrition(name: string) {
  const normalized = normalizeName(name)

  for (const entry of NUTRITION_DATA) {
    if (entry.matches.some(m => normalized.includes(m))) {
      return {
        protein: entry.protein,
        fat: entry.fat,
        carbs: entry.carbs,
        calories: entry.calories,
        measureType: entry.measureType,
        unitName: entry.unitName ?? null,
        unitGrams: entry.unitGrams ?? null,
        preparation: entry.preparation ?? null,
      }
    }
  }

  return {
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
    measureType: 'gram' as const,
    unitName: null,
    unitGrams: null,
    preparation: null,
  }
}
