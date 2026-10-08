import { Link } from 'react-router-dom'
import type { Occasion, Restaurant } from '../../types'
import { Chip } from '../ui/Chip'
import { PriceBadge } from './PriceBadge'

interface Props {
  restaurant: Restaurant
  occasion?: Occasion
}

export function RestaurantCardCompact({ restaurant, occasion }: Props) {
  const to = `/place/${restaurant.id}${occasion ? `?occasion=${occasion}` : ''}`
  const cover = restaurant.photos[0]

  return (
    <Link
      to={to}
      className="group block overflow-hidden rounded-card bg-surface shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[16/9] w-full bg-sand md:aspect-[4/3]">
        {cover ? (
          <img
            src={cover}
            alt={`${restaurant.name}: ${restaurant.cuisine} in ${restaurant.neighborhood}`}
            width={900}
            height={675}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-display text-lead font-bold leading-tight">{restaurant.name}</h3>
          <p className="text-caption text-ink-muted">
            {restaurant.neighborhood} · {restaurant.cuisine}
          </p>
        </div>
        <PriceBadge restaurant={restaurant} />
        <ul className="flex flex-wrap gap-1.5" aria-label="Vibe">
          {restaurant.vibeTags.slice(0, 3).map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
