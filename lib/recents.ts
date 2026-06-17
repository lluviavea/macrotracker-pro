export interface RecentFoodRef {
  name: string
  category: string
}

interface RecentEntry {
  food: string
  category: string
  createdAt: Date
}

export function selectRecents(entries: RecentEntry[], limit: number): RecentFoodRef[] {
  const seen = new Set<string>()
  const recents: RecentFoodRef[] = []

  for (const entry of entries) {
    const key = `${entry.category}|${entry.food}`
    if (seen.has(key)) continue
    seen.add(key)
    recents.push({ name: entry.food, category: entry.category })
    if (recents.length === limit) break
  }

  return recents
}
