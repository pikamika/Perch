import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { AccountForm } from '../components/profile/AccountForm'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingStatus } from '../components/ui/LoadingStatus'
import { Skeleton } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProfile } from '../hooks/useProfile'

export function AccountPage() {
  useDocumentTitle('Account')
  const { signOut } = useAuth()
  const { status, profile, reload } = useProfile()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    try {
      // Leave first: once signed out, the route guard would otherwise send us to the login screen.
      navigate('/', { replace: true })
      await signOut()
    } catch {
      // Still signed in: come back so the person can try again.
      navigate('/account', { replace: true })
    }
  }

  return (
    <div className="md:mx-auto md:max-w-md">
      <PageHeader title="Account" />

      {status === 'loading' && (
        <LoadingStatus label="Loading your account">
          <Skeleton className="mx-auto mb-4 h-28 w-28 rounded-full" />
          <Skeleton className="mb-3 h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </LoadingStatus>
      )}

      {status === 'error' && <ErrorState message="We couldn't load your account." onRetry={reload} />}

      {profile ? <AccountForm key={profile.id} profile={profile} /> : null}

      <Button variant="secondary" className="mt-8 w-full" disabled={pending} onClick={handleSignOut}>
        {pending ? 'Logging out…' : 'Log out'}
      </Button>
    </div>
  )
}
