'use client'

import { useTranslations } from 'next-intl'
import type { FoodItem } from '@/lib/types'
import { FoodCard } from './FoodCard'

interface FoodGridProps {
  foods: FoodItem[]
  onAdd: (food: FoodItem) => void
  showCategory?: boolean
  searchQuery?: string
}

export function FoodGrid({ foods, onAdd, showCategory, searchQuery }: FoodGridProps) {
  const t = useTranslations('FoodGrid')

  if (foods.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {searchQuery ? t('noSearchResults', { query: searchQuery }) : t('empty')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {searchQuery ? t('tryAnotherSearch') : t('emptyHint')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {foods.map(f => (
        <FoodCard key={`${f.category}-${f.name}`} food={f} onAdd={onAdd} showCategory={showCategory} />
      ))}
    </div>
  )
}
