import { Outlet, ScrollRestoration } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'

export function AppShell() {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-chip focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="main" className="mx-auto w-full max-w-md px-gutter pb-28 pt-6 md:max-w-3xl md:pb-12 lg:max-w-5xl">
        <Outlet />
      </main>
      <BottomNav />
      <ScrollRestoration />
    </div>
  )
}
