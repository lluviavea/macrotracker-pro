import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminClient from './AdminClient'

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    redirect(`/${locale}`)
  }

  return <AdminClient />
}
