export interface FavoriteRef {
  category: string
  name: string
}

const STORAGE_KEY = 'macrotracker-favorites'

function loadFavorites(): FavoriteRef[] {
  if (typeof globalThis.localStorage === 'undefined') return []
  try {
    const stored = globalThis.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

function saveFavorites(favorites: FavoriteRef[]): void {
  if (typeof globalThis.localStorage === 'undefined') return
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {}
}

function makeKey(category: string, name: string): string {
  return `${category}:${name}`
}

export function getFavorites(): FavoriteRef[] {
  return loadFavorites()
}

export function isFavorite(category: string, name: string): boolean {
  const key = makeKey(category, name)
  return loadFavorites().some(f => makeKey(f.category, f.name) === key)
}

export function toggleFavorite(category: string, name: string): FavoriteRef[] {
  const favorites = loadFavorites()
  const key = makeKey(category, name)
  const index = favorites.findIndex(f => makeKey(f.category, f.name) === key)
  if (index >= 0) {
    favorites.splice(index, 1)
  } else {
    favorites.push({ category, name })
  }
  saveFavorites(favorites)
  return favorites
}
