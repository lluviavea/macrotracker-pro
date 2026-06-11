'use client'

import type { FoodItem } from '@/lib/types'

interface FoodCardProps {
  food: FoodItem
  onAdd: (food: FoodItem) => void
}

export function FoodCard({ food, onAdd }: FoodCardProps) {
  return (
    <button
      onClick={() => onAdd(food)}
      className="bg-white rounded-xl p-3 border border-gray-200 text-left hover:border-blue-300 hover:shadow-sm transition-all text-sm"
    >
      <p className="font-medium truncate">{food.name}</p>
      <p className="text-xs text-gray-400 mt-1">{food.protein}P &middot; {food.fat}F &middot; {food.carbs}C &middot; {food.calories}kcal</p>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px] text-gray-400">/100{food.measureType === 'unit' && food.unitName ? food.unitName : 'g'}</span>
        {food.preparation && (
          <span className={`text-[10px] px-1.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{food.preparation}</span>
        )}
      </div>
    </button>
  )
}
