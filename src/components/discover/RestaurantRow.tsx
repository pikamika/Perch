import { useId } from 'react'
import type { Occasion, Restaurant } from '../../types'
import { RestaurantTile } from '../restaurant/RestaurantTile'
import { HorizontalScroller } from '../ui/HorizontalScroller'

interface Props {
  title: string
  subtitle?: string
  restaurants: Restaurant[]
  occasion?: Occasion
}

/** One DoorDash-style section: a heading and a swipeable row of tiles. */
export function RestaurantRow({ title, subtitle, restaurants, occasion }: Props) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId}>
      <div className="mb-3">
        <h2 id={headingId} className="font-display text-title">
          {title}
        </h2>
        {subtitle ? <p className="text-ink-muted">{subtitle}</p> : null}
      </div>
      <HorizontalScroller label={title}>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="w-[15rem] shrink-0 snap-start md:w-[17rem]">
            <RestaurantTile restaurant={restaurant} occasion={occasion} />
          </li>
        ))}
      </HorizontalScroller>
    </section>
  )
}
