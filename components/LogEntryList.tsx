'use client'

import type { FoodItem, Entry } from '@/lib/types'
import { LogEntryRow } from './LogEntryRow'

interface LogEntryListProps {
  entries: Entry[]
  foods: FoodItem[]
  onRemove: (index: number) => void
  onAmountInputChange: (index: number, value: string) => void
  onAmountBlur: (index: number) => void
}

export function LogEntryList({ entries, foods, onRemove, onAmountInputChange, onAmountBlur }: LogEntryListProps) {
  if (entries.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-400">Sin alimentos registrados</div>
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold">Registro</h2>
        <span className="text-xs text-gray-400">{entries.length} alimentos</span>
      </div>
      <div className="divide-y divide-gray-100">
        {entries.map((entry, i) => (
          <LogEntryRow
            key={entry.rowIndex}
            entry={entry}
            index={i}
            foods={foods}
            onRemove={onRemove}
            onAmountInputChange={onAmountInputChange}
            onAmountBlur={onAmountBlur}
          />
        ))}
      </div>
    </div>
  )
}
