import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  selected?: boolean
  /** When provided the chip is a toggle button (44px tap target). */
  onClick?: () => void
  className?: string
}

const look = (selected: boolean) =>
  selected
    ? 'border-brand bg-brand text-white'
    : 'border-line bg-surface text-ink'

export function Chip({ children, selected = false, onClick, className = '' }: ChipProps) {
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={`inline-flex min-h-touch items-center rounded-full border px-4 text-body font-medium transition-colors ${look(selected)} ${selected ? '' : 'hover:bg-sand'} ${className}`}
      >
        {children}
      </button>
    )
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-caption font-medium ${look(selected)} ${className}`}
    >
      {children}
    </span>
  )
}
