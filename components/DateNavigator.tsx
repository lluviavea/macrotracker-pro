'use client'

import { useTranslations } from 'next-intl'

interface DateNavigatorProps {
  date: string
  onDateChange: (date: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday?: () => void
}

export function DateNavigator({ date, onDateChange, onPrevDay, onNextDay, onToday }: DateNavigatorProps) {
  const t = useTranslations('DateNavigator')
  const isToday = date === new Date().toISOString().slice(0, 10)

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onPrevDay}
        className="px-3 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={t('prevDay')}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="relative">
        <input
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          className={`text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 ${isToday ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 font-medium' : 'border-gray-200 dark:border-gray-700 focus:ring-black/10 dark:focus:ring-white/20'}`}
        />
        {isToday && (
          <span className="absolute -top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
            {t('today')}
          </span>
        )}
      </div>
      <button
        onClick={onNextDay}
        className="px-3 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={t('nextDay')}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {!isToday && (
        <button
          onClick={onToday}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium transition-colors"
        >
          {t('today')}
        </button>
      )}
    </div>
  )
}
