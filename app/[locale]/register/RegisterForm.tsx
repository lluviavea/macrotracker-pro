'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function RegisterForm() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const locale = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
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
        body: JSON.stringify({ email, password, inviteCode }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('invalidInvite'))
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-[var(--foreground)]">
          {t('registerTitle')}
        </h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
              required
              minLength={8}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label htmlFor="inviteCode" className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
              {t('inviteCode')}
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
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
            {loading ? '...' : t('registerButton')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-[var(--foreground)] underline">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
