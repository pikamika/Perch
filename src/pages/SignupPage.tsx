import { Navigate, useSearchParams } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm'
import { PageHeader } from '../components/layout/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { parseNext } from '../lib/safeNext'

export function SignupPage() {
  useDocumentTitle('Create account')
  const { status } = useAuth()
  const [params] = useSearchParams()
  const next = parseNext(params.get('next'))

  if (status === 'signed-in') return <Navigate to={next} replace />

  return (
    <div className="md:mx-auto md:max-w-md">
      <PageHeader title="Create your account" subtitle="Find cafes with Wi-Fi, outlets and a seat before you leave home." />
      <AuthForm mode="signup" next={next} />
    </div>
  )
}
