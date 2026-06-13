import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import HomeClient from './HomeClient'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) {
    redirect(`/${locale}/login`)
  }

  return <HomeClient user={{ email: session.email, role: session.role }} />
}
