'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTransition } from 'react'

export function LangSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const nextLocale = locale === 'es' ? 'en' : 'es'

  function handleSwitch() {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="text-sm px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium transition-colors disabled:opacity-50"
    >
      {nextLocale === 'en' ? 'EN' : 'ES'}
    </button>
  )
}
