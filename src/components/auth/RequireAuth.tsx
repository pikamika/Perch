import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingStatus } from '../ui/LoadingStatus'
import { Skeleton } from '../ui/Skeleton'

/** Wraps routes that need an account. Signed-out visitors are sent to log in, then returned here. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <LoadingStatus label="Checking your account">
        <Skeleton className="mb-4 h-9 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </LoadingStatus>
    )
  }
  if (status === 'signed-out') {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <Outlet />
}
