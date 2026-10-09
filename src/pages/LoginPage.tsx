import { Navigate, useSearchParams } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm'
import { PageHeader } from '../components/layout/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { parseNext } from '../lib/safeNext'

export function LoginPage() {
  useDocumentTitle('Log in')
  const { status } = useAuth()
  const [params] = useSearchParams()
  const next = parseNext(params.get('next'))

  if (status === 'signed-in') return <Navigate to={next} replace />

  return (
    <div className="md:mx-auto md:max-w-md">
      <PageHeader title="Welcome back" subtitle="Log in to pick up where you left off." />
      <AuthForm mode="login" next={next} />
    </div>
  )
}
