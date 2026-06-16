'use client'

import { useTranslations } from 'next-intl'
import type { FoodItem, Entry } from '@/lib/types'
import { LogEntryRow } from './LogEntryRow'

interface LogEntryListProps {
  entries: Entry[]
  foods: FoodItem[]
  loading?: boolean
  onRemove: (index: number) => void
  onAmountInputChange: (index: number, value: string) => void
  onAmountBlur: (index: number) => void
}

const MEAL_COLORS: Record<string, string> = {
  desayuno: 'meal-desayuno border',
  comida: 'meal-comida border',
  cena: 'meal-cena border',
  snack: 'meal-snack border',
}

export function LogEntryList({ entries, foods, loading, onRemove, onAmountInputChange, onAmountBlur }: LogEntryListProps) {
  const t = useTranslations('LogEntryList')

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-3 animate-pulse animate-slide-up">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-slide-up">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('empty')}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('emptyHint')}</p>
      </div>
    )
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
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-slide-up">
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
