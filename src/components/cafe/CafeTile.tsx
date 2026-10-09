import { Link } from 'react-router-dom'
import { formatTypicalSpend } from '../../lib/format'
import type { Purpose, Cafe } from '../../types'
import { WorkChips } from './WorkChips'

interface Props {
  cafe: Cafe
  /** Carried to the cafe page so it can highlight the chosen purpose. */
  purpose?: Purpose
}

/** A photo-first tile for rows on Discover: big picture, then name and one line of facts. */
export function CafeTile({ cafe, purpose }: Props) {
  const to = `/place/${cafe.id}${purpose ? `?purpose=${purpose}` : ''}`
  const cover = cafe.photos[0]

  return (
    <Link to={to} className="group block rounded-photo">
      <div className="aspect-[4/3] overflow-hidden rounded-photo bg-sand">
        {cover ? (
          <img
            src={cover}
            alt={`${cafe.name}: ${cafe.specialty} in ${cafe.neighborhood}`}
            width={900}
            height={675}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="truncate font-semibold text-lead">{cafe.name}</h3>
        <p className="truncate text-caption text-ink-muted">
          <span className="font-semibold text-ink">{cafe.priceBand}</span> · {cafe.specialty} ·{' '}
          {cafe.neighborhood}
        </p>
        <p className="text-caption text-ink-muted">{formatTypicalSpend(cafe.typicalSpendPerPerson)}</p>
        <WorkChips cafe={cafe} />
      </div>
    </Link>
  )
}
