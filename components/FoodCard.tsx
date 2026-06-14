'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { FoodItem } from '@/lib/types'

interface FoodCardProps {
  food: FoodItem
  onAdd: (food: FoodItem) => void
}

export function FoodCard({ food, onAdd }: FoodCardProps) {
  const locale = useLocale()
  const t = useTranslations('FoodCard')
  const displayName = locale === 'en' && food.nameEn ? food.nameEn : food.name

  return (
    <button
      onClick={() => onAdd(food)}
      className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-left hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all text-sm"
    >
      <p className="font-medium truncate dark:text-gray-100">{displayName}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{food.protein}P &middot; {food.fat}F &middot; {food.carbs}C &middot; {food.calories}kcal</p>
      <p className="text-xs text-gray-400/70 dark:text-gray-500/70">
        {food.sugar > 0 && <span>{food.sugar}{t('sugar')} </span>}
        {food.fiber > 0 && <span>{food.fiber}{t('fiber')}</span>}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {food.measureType === 'unit' && food.unitName
            ? t('perUnit', { unit: food.unitName })
            : t('per100g')}
        </span>
        {food.preparation && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>{t(food.preparation)}</span>
        )}
      </div>
    </button>
  )
}
