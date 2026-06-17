import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getFavorites, isFavorite, toggleFavorite } from '@/lib/favorites'

describe('favorites', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => { storage[key] = value },
      removeItem: (key: string) => { delete storage[key] },
    })
  })

  it('starts empty', () => {
    expect(getFavorites()).toEqual([])
    expect(isFavorite('proteina', 'Pollo')).toBe(false)
  })

  it('adds a favorite', () => {
    toggleFavorite('proteina', 'Pollo')
    expect(isFavorite('proteina', 'Pollo')).toBe(true)
    expect(getFavorites()).toEqual([{ category: 'proteina', name: 'Pollo' }])
  })

  it('removes a favorite when toggled again', () => {
    toggleFavorite('proteina', 'Pollo')
    toggleFavorite('proteina', 'Pollo')
    expect(isFavorite('proteina', 'Pollo')).toBe(false)
    expect(getFavorites()).toEqual([])
  })

  it('keeps favorites independent per category and name', () => {
    toggleFavorite('proteina', 'Pollo')
    toggleFavorite('proteina', 'Res')
    toggleFavorite('carbohidratos', 'Arroz')
    expect(getFavorites()).toHaveLength(3)
    expect(isFavorite('proteina', 'Pollo')).toBe(true)
    expect(isFavorite('proteina', 'Res')).toBe(true)
    expect(isFavorite('carbohidratos', 'Arroz')).toBe(true)
  })
})
