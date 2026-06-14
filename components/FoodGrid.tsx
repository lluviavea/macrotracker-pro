'use client'

import type { FoodItem } from '@/lib/types'
import { FoodCard } from './FoodCard'

interface FoodGridProps {
  foods: FoodItem[]
  onAdd: (food: FoodItem) => void
  showCategory?: boolean
}

export function FoodGrid({ foods, onAdd, showCategory }: FoodGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {foods.map(f => (
        <FoodCard key={`${f.category}-${f.name}`} food={f} onAdd={onAdd} showCategory={showCategory} />
      ))}
    </div>
  )
}
