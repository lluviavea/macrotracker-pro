'use client'

import { useTranslations } from 'next-intl'
import type { FoodItem } from '@/lib/types'
import { FoodCard } from './FoodCard'

interface FavoriteFoodsProps {
  foods: FoodItem[]
  loading?: boolean
  onAdd: (food: FoodItem) => void
  isFavorite?: (food: FoodItem) => boolean
  onToggleFavorite?: (food: FoodItem) => void
}

export function FavoriteFoods({ foods, loading, onAdd, isFavorite, onToggleFavorite }: FavoriteFoodsProps) {
  const t = useTranslations('FavoriteFoods')

  if (foods.length === 0 && !loading) return null

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('title')}</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-36 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))
          : foods.map(f => (
              <div key={`fav-${f.category}-${f.name}`} className="shrink-0 w-36">
                <FoodCard
                  food={f}
                  onAdd={onAdd}
                  isFavorite={isFavorite?.(f)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
      </div>
    </section>
  )
}
