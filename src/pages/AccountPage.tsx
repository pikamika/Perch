import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AccountPage() {
  useDocumentTitle('Account')
  const { user, signOut } = useAuth()
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
      <section aria-labelledby="signed-in-as" className="rounded-card bg-surface p-5 shadow-card">
        <h2 id="signed-in-as" className="text-caption font-semibold text-ink-muted">
          Signed in as
        </h2>
        <p className="mt-1 break-all text-lead font-semibold">{user?.email}</p>
        <Button variant="secondary" className="mt-5 w-full" disabled={pending} onClick={handleSignOut}>
          {pending ? 'Logging out…' : 'Log out'}
        </Button>
      </section>
    </div>
  )
}
