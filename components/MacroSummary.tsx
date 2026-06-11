'use client'

interface MacroSummaryProps {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export function MacroSummary({ calories, protein, fat, carbs }: MacroSummaryProps) {
  const items = [
    { label: 'Calorías', value: Math.round(calories), unit: 'kcal', color: 'text-gray-900' },
    { label: 'Proteína', value: Math.round(protein * 10) / 10, unit: 'g', color: 'text-red-600' },
    { label: 'Grasa', value: Math.round(fat * 10) / 10, unit: 'g', color: 'text-orange-600' },
    { label: 'Carbs', value: Math.round(carbs * 10) / 10, unit: 'g', color: 'text-yellow-600' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm">
          <p className="text-xs text-gray-500 uppercase">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-400">{s.unit}</p>
        </div>
      ))}
    </div>
  )
}
