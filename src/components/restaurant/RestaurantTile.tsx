import { Link } from 'react-router-dom'
import { formatPerPerson } from '../../lib/format'
import type { Occasion, Restaurant } from '../../types'

interface Props {
  restaurant: Restaurant
  /** Carried to the confidence card so it can highlight the chosen occasion. */
  occasion?: Occasion
}

/** A photo-first tile for rows on Discover: big picture, then name and one line of facts. */
export function RestaurantTile({ restaurant, occasion }: Props) {
  const to = `/place/${restaurant.id}${occasion ? `?occasion=${occasion}` : ''}`
  const cover = restaurant.photos[0]

  return (
    <Link to={to} className="group block rounded-photo">
      <div className="aspect-[4/3] overflow-hidden rounded-photo bg-sand">
        {cover ? (
          <img
            src={cover}
            alt={`${restaurant.name}: ${restaurant.cuisine} in ${restaurant.neighborhood}`}
            width={900}
            height={675}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="truncate font-semibold text-lead">{restaurant.name}</h3>
        <p className="truncate text-caption text-ink-muted">
          <span className="font-semibold text-ink">{restaurant.priceBand}</span> · {restaurant.cuisine} ·{' '}
          {restaurant.neighborhood}
        </p>
        <p className="text-caption text-ink-muted">{formatPerPerson(restaurant.typicalSpendPerPerson)}</p>
      </div>
    </Link>
  )
}
