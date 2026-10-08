import { OCCASION_META } from '../../lib/occasions'
import { OCCASIONS, type Occasion } from '../../types'
import { Chip } from '../ui/Chip'

interface Props {
  selected?: Occasion
  onChange: (occasion: Occasion | undefined) => void
}

export function OccasionFilter({ selected, onChange }: Props) {
  return (
    <div role="group" aria-label="Filter by occasion" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip selected={selected === undefined} onClick={() => onChange(undefined)} className="shrink-0">
        All
      </Chip>
      {OCCASIONS.map((occasion) => (
        <Chip
          key={occasion}
          selected={selected === occasion}
          onClick={() => onChange(selected === occasion ? undefined : occasion)}
          className="shrink-0"
        >
          {OCCASION_META[occasion].label}
        </Chip>
      ))}
    </div>
  )
}
