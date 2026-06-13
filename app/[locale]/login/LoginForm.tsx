'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LangSwitcher } from '@/components/LangSwitcher'

export default function LoginForm() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('invalidCredentials'))
        return
      }

      router.push(`/${locale}`)
      router.refresh()
    } catch {
      setError(t('invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-end gap-2">
          <ThemeToggle />
          <LangSwitcher />
        </div>
        <h1 className="mb-6 text-center text-2xl font-semibold text-[var(--foreground)]">
          {t('loginTitle')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--foreground)] px-4 py-2 font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : t('loginButton')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-[var(--foreground)] underline">
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
