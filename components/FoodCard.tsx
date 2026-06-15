'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { FoodItem } from '@/lib/types'

interface FoodCardProps {
  food: FoodItem
  onAdd: (food: FoodItem) => void
  showCategory?: boolean
}

export function FoodCard({ food, onAdd, showCategory }: FoodCardProps) {
  const locale = useLocale()
  const t = useTranslations('FoodCard')
  const tc = useTranslations('CategoryTabs')
  const displayName = locale === 'en' && food.nameEn ? food.nameEn : food.name

  return (
    <button
      onClick={() => onAdd(food)}
      className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-left hover:[border-color:var(--macro-calories)] hover:shadow-sm transition-all text-sm"
    >
      <p className="font-medium truncate dark:text-gray-100">{displayName}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{food.protein}<span className="macro-protein">P</span> &middot; {food.fat}<span className="macro-fat">F</span> &middot; {food.carbs}<span className="macro-carbs">C</span> &middot; <span className="macro-calories">{food.calories}</span><span className="macro-calories">kcal</span></p>
      <p className="text-xs text-gray-400/70 dark:text-gray-500/70">
        {food.sugar > 0 && <span>{food.sugar}{t('sugar')} </span>}
        {food.fiber > 0 && <span>{food.fiber}{t('fiber')}</span>}
      </p>
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {food.measureType === 'unit' && food.unitName
            ? t('perUnit', { unit: food.unitName })
            : t('per100g')}
        </span>
        {showCategory && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {tc(food.category)}
          </span>
        )}
        {food.preparation && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>{t(food.preparation)}</span>
        )}
      </div>
    </button>
  )
}
