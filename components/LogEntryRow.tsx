'use client'

import { useState } from 'react'
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
  const [isRemoving, setIsRemoving] = useState(false)
  const food = findFood(foods, entry.foodName, entry.category)
  const displayName = locale === 'en' && food?.nameEn ? food.nameEn : entry.foodName
  const liveAmount = parseFloat(entry.amountInput) || 0
  const macros = food ? calculateMacros(food, liveAmount) : { protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 }
  const isUnit = food?.measureType === 'unit' && food?.unitName

  function handleRemove() {
    setIsRemoving(true)
    setTimeout(() => onRemove(index), 250)
  }

  return (
    <div className={`p-3 flex items-center gap-3 animate-slide-up transition-all duration-250 ${isRemoving ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <button onClick={handleRemove} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg leading-none">&times;</button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate dark:text-gray-100">{displayName}</p>
        <div className="flex gap-1 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">{entry.category}</span>
          {food?.preparation && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium prep-${food.preparation}`}>{t(food.preparation)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode={isUnit ? 'numeric' : 'decimal'}
          value={entry.amountInput}
          onChange={e => onAmountInputChange(index, e.target.value)}
          onBlur={() => onAmountBlur(index)}
          placeholder="0"
          className="w-24 sm:w-28 text-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-100"
          min={0}
          step={isUnit ? 1 : 10}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{isUnit ? food?.unitName : 'g'}</span>
      </div>
      <div className="text-right text-sm w-28 leading-tight">
        <p className="text-gray-500 dark:text-gray-400">{macros.protein}<span className="macro-protein">P</span></p>
        <p className="text-gray-500 dark:text-gray-400">{macros.fat}<span className="macro-fat">F</span></p>
        <p className="text-gray-500 dark:text-gray-400">{macros.carbs}<span className="macro-carbs">C</span> <span className="text-gray-400 dark:text-gray-500">(<span className="macro-sugar">S</span> / <span className="macro-fiber">Fb</span>)</span></p>
        <p className="font-medium"><span className="macro-calories">{macros.calories}</span> <span className="macro-calories">kcal</span></p>
      </div>
    </div>
  )
}
