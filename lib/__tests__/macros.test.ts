import { describe, it, expect } from 'vitest'
import { calculateMacros, findFood, calculateTotals } from '../macros'
import type { FoodItem } from '../types'

const egg: FoodItem = {
  id: 1,
  name: 'huevo',
  category: 'proteina',
  protein: 13,
  fat: 11,
  carbs: 1.1,
  sugar: 1.1,
  fiber: 0,
  calories: 155,
  measureType: 'unit',
  unitName: 'huevo',
  unitGrams: 60,
  preparation: 'crudo',
}

const chicken: FoodItem = {
  id: 2,
  name: 'pollo',
  category: 'proteina',
  protein: 31,
  fat: 3.6,
  carbs: 0,
  sugar: 0,
  fiber: 0,
  calories: 165,
  measureType: 'gram',
  unitName: null,
  unitGrams: null,
  preparation: 'crudo',
}

const rice: FoodItem = {
  id: 3,
  name: 'arroz',
  category: 'carbohidratos',
  protein: 2.6,
  fat: 0.3,
  carbs: 28,
  sugar: 0.1,
  fiber: 0.4,
  calories: 130,
  measureType: 'gram',
  unitName: null,
  unitGrams: null,
  preparation: 'cocido',
}

const foods: FoodItem[] = [egg, chicken, rice]

describe('calculateMacros', () => {
  it('calculates macros for gram-based food at 100g', () => {
    const result = calculateMacros(chicken, 100)
    expect(result.protein).toBe(31)
    expect(result.fat).toBe(3.6)
    expect(result.carbs).toBe(0)
    expect(result.sugar).toBe(0)
    expect(result.fiber).toBe(0)
    expect(result.calories).toBe(165)
  })

  it('calculates macros for gram-based food at 50g (half)', () => {
    const result = calculateMacros(chicken, 50)
    expect(result.protein).toBe(15.5)
    expect(result.fat).toBe(1.8)
    expect(result.carbs).toBe(0)
    expect(result.sugar).toBe(0)
    expect(result.fiber).toBe(0)
    expect(result.calories).toBe(83)
  })

  it('calculates macros for unit-based food at 1 unit', () => {
    const result = calculateMacros(egg, 1)
    expect(result.protein).toBe(7.8)
    expect(result.fat).toBe(6.6)
    expect(result.carbs).toBe(0.7)
    expect(result.sugar).toBe(0.7)
    expect(result.fiber).toBe(0)
    expect(result.calories).toBe(93)
  })

  it('calculates macros for unit-based food at 2 units', () => {
    const result = calculateMacros(egg, 2)
    expect(result.protein).toBe(15.6)
    expect(result.fat).toBe(13.2)
    expect(result.carbs).toBe(1.3)
    expect(result.sugar).toBe(1.3)
    expect(result.fiber).toBe(0)
    expect(result.calories).toBe(186)
  })

  it('handles zero calories food', () => {
    const salt: FoodItem = {
      id: 99,
      name: 'sal',
      category: 'condimentos',
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
    const result = calculateMacros(salt, 100)
    expect(result.protein).toBe(0)
    expect(result.fat).toBe(0)
    expect(result.carbs).toBe(0)
    expect(result.sugar).toBe(0)
    expect(result.fiber).toBe(0)
    expect(result.calories).toBe(0)
  })
})

describe('findFood', () => {
  it('finds food by name and category', () => {
    const result = findFood(foods, 'pollo', 'proteina')
    expect(result).toBe(chicken)
  })

  it('returns undefined when no match', () => {
    const result = findFood(foods, 'pollo', 'carbohidratos')
    expect(result).toBeUndefined()
  })
})

describe('calculateTotals', () => {
  it('sums macros for multiple entries', () => {
    const entries = [
      { foodName: 'pollo', category: 'proteina', amount: 100 },
      { foodName: 'arroz', category: 'carbohidratos', amount: 100 },
    ]
    const result = calculateTotals(foods, entries)
    expect(result.protein).toBe(33.6)
    expect(result.fat).toBe(3.9)
    expect(result.carbs).toBe(28)
    expect(result.sugar).toBe(0.1)
    expect(result.fiber).toBe(0.4)
    expect(result.calories).toBe(295)
  })

  it('returns zeros for empty entries', () => {
    const result = calculateTotals(foods, [])
    expect(result.protein).toBe(0)
    expect(result.fat).toBe(0)
    expect(result.carbs).toBe(0)
    expect(result.calories).toBe(0)
  })

  it('skips entries with no matching food', () => {
    const entries = [
      { foodName: 'unknown', category: 'proteina', amount: 100 },
    ]
    const result = calculateTotals(foods, entries)
    expect(result.protein).toBe(0)
    expect(result.fat).toBe(0)
    expect(result.carbs).toBe(0)
    expect(result.calories).toBe(0)
  })
})
