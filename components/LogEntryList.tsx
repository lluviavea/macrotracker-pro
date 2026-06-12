'use client'

import { useTranslations } from 'next-intl'
import type { FoodItem, Entry } from '@/lib/types'
import { LogEntryRow } from './LogEntryRow'

interface LogEntryListProps {
  entries: Entry[]
  foods: FoodItem[]
  onRemove: (index: number) => void
  onAmountInputChange: (index: number, value: string) => void
  onAmountBlur: (index: number) => void
}

const MEAL_COLORS: Record<string, string> = {
  desayuno: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
  comida: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900',
  cena: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900',
  snack: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
}

export function LogEntryList({ entries, foods, onRemove, onAmountInputChange, onAmountBlur }: LogEntryListProps) {
  const t = useTranslations('LogEntryList')

  if (entries.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t('empty')}</div>
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

  const mealLabels: Record<string, string> = {
    desayuno: t('breakfast'),
    comida: t('lunch'),
    cena: t('dinner'),
    snack: t('snack'),
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold dark:text-gray-100">{t('title')}</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">{t('count', { count: entries.length })}</span>
      </div>
      {grouped.map(group => (
        <div key={group.meal || '__none'} className={group.meal ? MEAL_COLORS[group.meal] ?? '' : ''}>
          {group.meal && (
            <div className="px-4 py-2 border-b border-inherit">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {mealLabels[group.meal] || group.meal}
              </span>
            </div>
          )}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
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
