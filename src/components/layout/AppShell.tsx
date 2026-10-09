import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { APP_NAME } from '../../lib/brand'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'

export function AppShell() {
  const { status } = useAuth()
  // Navigation only appears once someone is logged in.
  const showNav = status === 'signed-in'

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-chip focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
      >
        Skip to content
      </a>
      {showNav ? (
        <TopNav />
      ) : (
        <p className="px-gutter pt-8 text-center font-display text-lead font-bold text-brand-dark">{APP_NAME}</p>
      )}
      <main
        id="main"
        className={`mx-auto w-full max-w-md px-gutter pt-6 md:max-w-3xl lg:max-w-5xl ${
          showNav ? 'pb-28 md:pb-12' : 'pb-12'
        }`}
      >
        <Outlet />
      </main>
      {showNav ? <BottomNav /> : null}
      <ScrollRestoration />
    </div>
  )
}
