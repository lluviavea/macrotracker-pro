import { describe, it, expect } from 'vitest'
import { selectRecents } from '../recents'

function entry(food: string, category: string, createdAt: Date) {
  return { food, category, createdAt }
}

function date(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000)
}

describe('selectRecents', () => {
  it('returns empty array when no entries', () => {
    expect(selectRecents([], 8)).toEqual([])
  })

  it('returns foods ordered by most recent first', () => {
    const entries = [
      entry('Pollo', 'proteina', date(0)),
      entry('Arroz', 'carbohidratos', date(5)),
      entry('Aguacate', 'grasas', date(10)),
    ]

    expect(selectRecents(entries, 8)).toEqual([
      { name: 'Pollo', category: 'proteina' },
      { name: 'Arroz', category: 'carbohidratos' },
      { name: 'Aguacate', category: 'grasas' },
    ])
  })

  it('deduplicates repeated foods keeping the most recent occurrence', () => {
    const entries = [
      entry('Pollo', 'proteina', date(0)),
      entry('Pollo', 'proteina', date(5)),
      entry('Arroz', 'carbohidratos', date(10)),
    ]

    expect(selectRecents(entries, 8)).toEqual([
      { name: 'Pollo', category: 'proteina' },
      { name: 'Arroz', category: 'carbohidratos' },
    ])
  })

  it('treats same name in different categories as different foods', () => {
    const entries = [
      entry('Plátano', 'frutas', date(0)),
      entry('Plátano', 'carbohidratos', date(5)),
    ]

    expect(selectRecents(entries, 8)).toEqual([
      { name: 'Plátano', category: 'frutas' },
      { name: 'Plátano', category: 'carbohidratos' },
    ])
  })

  it('respects the limit', () => {
    const entries = [
      entry('A', 'proteina', date(0)),
      entry('B', 'proteina', date(5)),
      entry('C', 'proteina', date(10)),
    ]

    expect(selectRecents(entries, 2)).toEqual([
      { name: 'A', category: 'proteina' },
      { name: 'B', category: 'proteina' },
    ])
  })
})
