import type { ReactNode } from 'react'

/** Wraps skeletons so screen readers hear a short "Loading" message. */
export function LoadingStatus({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
