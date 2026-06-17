'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LangSwitcher } from '@/components/LangSwitcher'

export default function RegisterForm() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const locale = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('registerError'))
        return
      }

      router.push(`/${locale}`)
      router.refresh()
    } catch {
      setError(t('invalidInvite'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-end gap-2 p-4">
        <ThemeToggle />
        <LangSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t('registerTitle')}
        </h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 dark:bg-white px-4 py-2 font-medium text-white dark:text-gray-900 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : t('registerButton')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-gray-900 dark:text-gray-100 underline">
            {t('loginLink')}
          </Link>
        </p>
      </div>
      </main>
    </div>
  )
}
