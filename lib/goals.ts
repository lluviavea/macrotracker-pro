export interface Goals {
  calories: number
  protein: number
  fat: number
  carbs: number
}

const STORAGE_KEY = 'macrotracker-goals'

const DEFAULTS: Goals = {
  calories: 2000,
  protein: 100,
  fat: 65,
  carbs: 250,
}

export function getGoals(): Goals {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULTS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULTS
}

export function saveGoals(goals: Goals): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  } catch {}
}
