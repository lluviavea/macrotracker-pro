'use client'

interface DateNavigatorProps {
  date: string
  onDateChange: (date: string) => void
  onPrevDay: () => void
  onNextDay: () => void
}

export function DateNavigator({ date, onDateChange, onPrevDay, onNextDay }: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button onClick={onPrevDay} className="text-sm text-gray-400 hover:text-gray-600">&larr;</button>
      <input
        type="date"
        value={date}
        onChange={e => onDateChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
      />
      <button onClick={onNextDay} className="text-sm text-gray-400 hover:text-gray-600">&rarr;</button>
    </div>
  )
}
