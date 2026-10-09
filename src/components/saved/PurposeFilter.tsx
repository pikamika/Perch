import { PURPOSE_META } from '../../lib/purposes'
import { PURPOSES, type Purpose } from '../../types'
import { Chip } from '../ui/Chip'

interface Props {
  selected?: Purpose
  onChange: (purpose: Purpose | undefined) => void
}

export function PurposeFilter({ selected, onChange }: Props) {
  return (
    <div role="group" aria-label="Filter by purpose" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip selected={selected === undefined} onClick={() => onChange(undefined)} className="shrink-0">
        All
      </Chip>
      {PURPOSES.map((purpose) => (
        <Chip
          key={purpose}
          selected={selected === purpose}
          onClick={() => onChange(selected === purpose ? undefined : purpose)}
          className="shrink-0"
        >
          {PURPOSE_META[purpose].label}
        </Chip>
      ))}
    </div>
  )
}
