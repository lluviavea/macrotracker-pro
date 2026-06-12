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
      className="bg-white rounded-xl p-3 border border-gray-200 text-left hover:border-blue-300 hover:shadow-sm transition-all text-sm"
    >
      <p className="font-medium truncate">{displayName}</p>
      <p className="text-xs text-gray-400 mt-1">{food.protein}P &middot; {food.fat}F &middot; {food.carbs}C &middot; {food.calories}kcal</p>
      <p className="text-xs text-gray-400/70">
        {food.sugar > 0 && <span>{food.sugar}{t('sugar')} </span>}
        {food.fiber > 0 && <span>{food.fiber}{t('fiber')}</span>}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-gray-400">{t('per', { unit: food.measureType === 'unit' && food.unitName ? food.unitName : 'g' })}</span>
        {food.preparation && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{t(food.preparation)}</span>
        )}
      </div>
    </button>
  )
}
