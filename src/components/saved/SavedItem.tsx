import { Link } from 'react-router-dom'
import { OCCASION_META } from '../../lib/occasions'
import type { Restaurant, SavedPlace } from '../../types'
import { Chip } from '../ui/Chip'
import { ExternalIcon, TrashIcon } from '../ui/icons'

interface Props {
  place: SavedPlace
  /** Matching restaurant, when the place was saved from a confidence card. */
  restaurant?: Restaurant
  removing?: boolean
  onRemove: (place: SavedPlace) => void
}

export function SavedItem({ place, restaurant, removing = false, onRemove }: Props) {
  const cover = restaurant?.photos[0]
  const meta = restaurant ? `${restaurant.neighborhood} · ${restaurant.cuisine}` : 'Added from a link'

  const content = (
    <>
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-photo bg-sand">
        {cover ? (
          <img src={cover} alt="" width={160} height={160} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden="true" className="flex h-full w-full items-center justify-center text-3xl">
            🔗
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h2 className="line-clamp-2 font-display text-lead font-bold leading-tight">{place.name}</h2>
        <p className="flex items-center gap-1 truncate text-caption text-ink-muted">
          {meta}
          {!restaurant && place.sourceUrl ? (
            <>
              <ExternalIcon width={14} height={14} />
              <span className="sr-only">(opens the original link in a new tab)</span>
            </>
          ) : null}
        </p>
        {place.occasions.length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap gap-1" aria-label="Best for">
            {place.occasions.map((o) => (
              <li key={o}>
                <Chip>{OCCASION_META[o].label}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )

  const linkClasses = 'flex min-w-0 flex-1 items-center gap-3 rounded-card p-3'

  return (
    <li className="flex items-center rounded-card bg-surface shadow-card">
      {restaurant ? (
        <Link to={`/place/${restaurant.id}`} className={linkClasses}>
          {content}
        </Link>
      ) : place.sourceUrl ? (
        <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClasses}>
          {content}
        </a>
      ) : (
        <div className={linkClasses}>{content}</div>
      )}
      <button
        type="button"
        onClick={() => onRemove(place)}
        disabled={removing}
        aria-label={`Remove ${place.name} from saved`}
        className="mr-2 flex h-touch w-touch shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-brand-soft hover:text-danger disabled:opacity-50"
      >
        <TrashIcon />
      </button>
    </li>
  )
}
