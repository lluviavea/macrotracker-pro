'use client'

import type { FoodItem, Entry } from '@/lib/types'
import { LogEntryRow } from './LogEntryRow'

interface LogEntryListProps {
  entries: Entry[]
  foods: FoodItem[]
  onRemove: (index: number) => void
  onAmountInputChange: (index: number, value: string) => void
  onAmountBlur: (index: number) => void
}

const MEAL_LABELS: Record<string, string> = {
  desayuno: 'Desayuno',
  comida: 'Comida',
  cena: 'Cena',
  snack: 'Snack',
}

const MEAL_COLORS: Record<string, string> = {
  desayuno: 'bg-blue-50 border-blue-200',
  comida: 'bg-orange-50 border-orange-200',
  cena: 'bg-purple-50 border-purple-200',
  snack: 'bg-green-50 border-green-200',
}

export function LogEntryList({ entries, foods, onRemove, onAmountInputChange, onAmountBlur }: LogEntryListProps) {
  if (entries.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-400">Sin alimentos registrados</div>
  }

  const grouped: { meal: string; entries: Entry[]; startIndex: number }[] = []
  let currentMeal = entries[0]?.meal ?? ''
  let groupStart = 0

  entries.forEach((entry, i) => {
    const meal = entry.meal ?? ''
    if (meal !== currentMeal) {
      grouped.push({ meal: currentMeal, entries: entries.slice(groupStart, i), startIndex: groupStart })
      currentMeal = meal
      groupStart = i
    }
  })
  grouped.push({ meal: currentMeal, entries: entries.slice(groupStart), startIndex: groupStart })

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold">Registro</h2>
        <span className="text-xs text-gray-400">{entries.length} alimentos</span>
      </div>
      {grouped.map(group => (
        <div key={group.meal || '__none'} className={group.meal ? MEAL_COLORS[group.meal] ?? '' : ''}>
          {group.meal && (
            <div className="px-4 py-2 border-b border-inherit">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {MEAL_LABELS[group.meal] || group.meal}
              </span>
            </div>
          )}
          <div className="divide-y divide-gray-100">
            {group.entries.map((entry, j) => (
              <LogEntryRow
                key={entry.id}
                entry={entry}
                index={group.startIndex + j}
                foods={foods}
                onRemove={onRemove}
                onAmountInputChange={onAmountInputChange}
                onAmountBlur={onAmountBlur}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
