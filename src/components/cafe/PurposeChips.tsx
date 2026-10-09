import { PURPOSE_META } from '../../lib/purposes'
import type { Purpose } from '../../types'
import { Chip } from '../ui/Chip'

interface Props {
  bestFor: Purpose[]
  /** The purpose picked on Home; highlighted when the place suits it. */
  highlight?: Purpose
}

export function PurposeChips({ bestFor, highlight }: Props) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Best for">
      {bestFor.map((purpose) => {
        const isMatch = purpose === highlight
        const { label, emoji } = PURPOSE_META[purpose]
        return (
          <li key={purpose}>
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
