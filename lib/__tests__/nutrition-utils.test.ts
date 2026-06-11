import { describe, it, expect } from 'vitest'
import { normalizeName, lookupNutrition } from '../nutrition-utils'

describe('normalizeName', () => {
  it('lowercases the input', () => {
    expect(normalizeName('POLLO')).toBe('pollo')
    expect(normalizeName('ArRoZ')).toBe('arroz')
  })

  it('removes accents', () => {
    expect(normalizeName('brócoli')).toBe('brocoli')
    expect(normalizeName('atún')).toBe('atun')
    expect(normalizeName('cúrcuma')).toBe('curcuma')
  })

  it('removes special characters', () => {
    expect(normalizeName('pollo!')).toBe('pollo')
    expect(normalizeName('queso (fresco)')).toBe('queso fresco')
  })

  it('trims whitespace', () => {
    expect(normalizeName('  pollo  ')).toBe('pollo')
  })
})

describe('lookupNutrition', () => {
  it('finds a food by exact match', () => {
    const result = lookupNutrition('pollo')
    expect(result.protein).toBe(31)
    expect(result.fat).toBe(3.6)
    expect(result.carbs).toBe(0)
    expect(result.calories).toBe(165)
    expect(result.measureType).toBe('gram')
  })

  it('finds a food with accent normalization', () => {
    const result = lookupNutrition('brócoli')
    expect(result.protein).toBe(2.8)
  })

  it('finds a food with partial name match', () => {
    const result = lookupNutrition('pechuga de pollo')
    expect(result.protein).toBe(31)
  })

  it('returns zeros for unknown food', () => {
    const result = lookupNutrition('comida inexistente')
    expect(result.protein).toBe(0)
    expect(result.fat).toBe(0)
    expect(result.carbs).toBe(0)
    expect(result.calories).toBe(0)
    expect(result.measureType).toBe('gram')
    expect(result.unitName).toBeNull()
    expect(result.unitGrams).toBeNull()
    expect(result.preparation).toBeNull()
  })

  it('finds a unit-based food', () => {
    const result = lookupNutrition('huevo')
    expect(result.measureType).toBe('unit')
    expect(result.unitName).toBe('huevo')
    expect(result.unitGrams).toBe(60)
  })

  it('finds a food with preparation', () => {
    const result = lookupNutrition('frijoles')
    expect(result.preparation).toBe('cocido')
  })
})
