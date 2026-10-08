import { OCCASION_META } from '../../lib/occasions'
import type { Occasion } from '../../types'
import { Chip } from '../ui/Chip'

interface Props {
  bestFor: Occasion[]
  /** The occasion picked on Home; highlighted when the place suits it. */
  highlight?: Occasion
}

export function OccasionChips({ bestFor, highlight }: Props) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Best for">
      {bestFor.map((occasion) => {
        const isMatch = occasion === highlight
        const { label, emoji } = OCCASION_META[occasion]
        return (
          <li key={occasion}>
            <Chip selected={isMatch} className="!px-3.5 !py-1.5 !text-body">
              <span aria-hidden="true" className="mr-1.5">
                {emoji}
              </span>
              {label}
              {isMatch ? <span className="sr-only"> (matches your pick)</span> : null}
            </Chip>
          </li>
        )
      })}
    </ul>
  )
}
