import { formatTypicalSpend } from '../../lib/format'
import type { Cafe } from '../../types'

export function PriceBadge({ cafe }: { cafe: Pick<Cafe, 'priceBand' | 'typicalSpendPerPerson'> }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-bold text-ink" aria-label={`Price band ${cafe.priceBand.length} out of 3`}>
        {cafe.priceBand}
      </span>
      <span className="text-ink-muted">{formatTypicalSpend(cafe.typicalSpendPerPerson)}</span>
    </p>
  )
}
