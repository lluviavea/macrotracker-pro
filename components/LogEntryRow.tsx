'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { FoodItem, Entry } from '@/lib/types'
import { findFood, calculateMacros } from '@/lib/macros'

interface LogEntryRowProps {
  entry: Entry
  index: number
  foods: FoodItem[]
  onRemove: (index: number) => void
  onAmountInputChange: (index: number, value: string) => void
  onAmountBlur: (index: number) => void
}

export function LogEntryRow({ entry, index, foods, onRemove, onAmountInputChange, onAmountBlur }: LogEntryRowProps) {
  const locale = useLocale()
  const t = useTranslations('LogEntryRow')
  const food = findFood(foods, entry.foodName, entry.category)
  const displayName = locale === 'en' && food?.nameEn ? food.nameEn : entry.foodName
  const liveAmount = parseFloat(entry.amountInput) || 0
  const macros = food ? calculateMacros(food, liveAmount) : { protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 }
  const isUnit = food?.measureType === 'unit' && food?.unitName

  return (
    <div className="p-3 flex items-center gap-3">
      <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg leading-none">&times;</button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate dark:text-gray-100">{displayName}</p>
        <div className="flex gap-1 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">{entry.category}</span>
          {food?.preparation && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>{t(food.preparation)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={entry.amountInput}
          onChange={e => onAmountInputChange(index, e.target.value)}
          onBlur={() => onAmountBlur(index)}
          placeholder="0"
          className="w-20 text-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-100"
          min={0}
          step={isUnit ? 1 : 10}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{isUnit ? food?.unitName : 'g'}</span>
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 w-28 leading-tight">
        <p>{macros.protein}P</p>
        <p>{macros.fat}F</p>
        <p>{macros.carbs}C <span className="text-gray-400 dark:text-gray-500">({macros.sugar}S / {macros.fiber}Fb)</span></p>
        <p className="font-medium dark:text-gray-100">{macros.calories}kcal</p>
      </div>
    </div>
  )
}
