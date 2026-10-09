import { formatPhotoDate, getFreshness } from '../../lib/freshness'

export function FreshnessBadge({ photosUpdatedAt }: { photosUpdatedAt: string }) {
  const { label, isFresh } = getFreshness(photosUpdatedAt)
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-chip px-3 py-2 text-caption font-semibold ${
        isFresh ? 'bg-accent-soft text-ink' : 'bg-sand text-ink-muted'
      }`}
    >
      <span aria-hidden="true">{isFresh ? '📸' : '🕰️'}</span>
      <span>
        {label}
        <span className="font-normal"> · updated {formatPhotoDate(photosUpdatedAt)}</span>
      </span>
    </p>
  )
}
