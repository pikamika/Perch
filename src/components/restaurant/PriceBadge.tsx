import { formatPerPerson } from '../../lib/format'
import type { Restaurant } from '../../types'

export function PriceBadge({ restaurant }: { restaurant: Pick<Restaurant, 'priceBand' | 'typicalSpendPerPerson'> }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-bold text-ink" aria-label={`Price band ${restaurant.priceBand.length} out of 3`}>
        {restaurant.priceBand}
      </span>
      <span className="text-ink-muted">{formatPerPerson(restaurant.typicalSpendPerPerson)}</span>
    </p>
  )
}
