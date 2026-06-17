'use client'

import { useTranslations } from 'next-intl'

interface CopyPreviousDayProps {
  onCopy: () => void
  disabled?: boolean
}

export function CopyPreviousDay({ onCopy, disabled }: CopyPreviousDayProps) {
  const t = useTranslations('CopyPreviousDay')

  return (
    <button
      onClick={onCopy}
      disabled={disabled}
      className="text-xs sm:text-sm px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {t('copy')}
    </button>
  )
}
