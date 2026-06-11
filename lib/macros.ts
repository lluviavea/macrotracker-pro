import type { FoodItem } from './types'

export interface MacroResult {
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
}

export function calculateMacros(
  food: FoodItem,
  amount: number,
): MacroResult {
  const factor =
    food.measureType === 'unit' && food.unitGrams
      ? (amount * food.unitGrams) / 100
      : amount / 100
  return {
    protein: Math.round(food.protein * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    sugar: Math.round(food.sugar * factor * 10) / 10,
    fiber: Math.round(food.fiber * factor * 10) / 10,
    calories: Math.round(food.calories * factor),
  }
}

export function findFood(
  foods: FoodItem[],
  name: string,
  category: string,
): FoodItem | undefined {
  return foods.find(f => f.name === name && f.category === category)
}

export function calculateTotals(
  foods: FoodItem[],
  entries: { foodName: string; category: string; amount: number }[],
): MacroResult {
  return entries.reduce(
    (acc, e) => {
      const food = findFood(foods, e.foodName, e.category)
      if (!food) return acc
      const m = calculateMacros(food, e.amount)
      return {
        protein: acc.protein + m.protein,
        fat: acc.fat + m.fat,
        carbs: acc.carbs + m.carbs,
        sugar: acc.sugar + m.sugar,
        fiber: acc.fiber + m.fiber,
        calories: acc.calories + m.calories,
      }
    },
    { protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 },
  )
}
