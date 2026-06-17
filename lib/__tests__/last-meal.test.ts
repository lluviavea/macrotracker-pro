import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getLastMeal, saveLastMeal } from '@/lib/last-meal'

describe('last-meal', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => { storage[key] = value },
      removeItem: (key: string) => { delete storage[key] },
    })
  })

  it('returns empty string when no meal is stored', () => {
    expect(getLastMeal('proteina', 'Pollo')).toBe('')
  })

  it('saves and retrieves the last meal for a food', () => {
    saveLastMeal('proteina', 'Pollo', 'comida')
    expect(getLastMeal('proteina', 'Pollo')).toBe('comida')
  })

  it('keeps meals independent per category and name', () => {
    saveLastMeal('proteina', 'Pollo', 'comida')
    saveLastMeal('carbohidratos', 'Arroz', 'cena')
    expect(getLastMeal('proteina', 'Pollo')).toBe('comida')
    expect(getLastMeal('carbohidratos', 'Arroz')).toBe('cena')
  })

  it('removes the entry when meal is empty', () => {
    saveLastMeal('proteina', 'Pollo', 'comida')
    saveLastMeal('proteina', 'Pollo', '')
    expect(getLastMeal('proteina', 'Pollo')).toBe('')
  })
})
