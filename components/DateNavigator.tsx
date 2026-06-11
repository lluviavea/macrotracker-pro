'use client'

interface DateNavigatorProps {
  date: string
  onDateChange: (date: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday?: () => void
}

export function DateNavigator({ date, onDateChange, onPrevDay, onNextDay, onToday }: DateNavigatorProps) {
  const isToday = date === new Date().toISOString().slice(0, 10)

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onPrevDay}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Día anterior"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <input
        type="date"
        value={date}
        onChange={e => onDateChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        onClick={onNextDay}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Día siguiente"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {!isToday && (
        <button
          onClick={onToday}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
        >
          Hoy
        </button>
      )}
    </div>
  )
}
