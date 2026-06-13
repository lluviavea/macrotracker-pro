import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import RegisterForm from './RegisterForm'

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (session) {
    redirect(`/${locale}`)
  }
  return <RegisterForm />
}
