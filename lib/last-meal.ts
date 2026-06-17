const STORAGE_KEY = 'macrotracker-last-meals'

function makeKey(category: string, name: string): string {
  return `${category}:${name}`
}

function loadMap(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch {}
  return {}
}

function saveMap(map: Record<string, string>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {}
}

export function getLastMeal(category: string, name: string): string {
  return loadMap()[makeKey(category, name)] ?? ''
}

export function saveLastMeal(category: string, name: string, meal: string): void {
  const map = loadMap()
  if (!meal) {
    delete map[makeKey(category, name)]
  } else {
    map[makeKey(category, name)] = meal
  }
  saveMap(map)
}
