import { OCCASION_META } from '../../lib/occasions'
import { OCCASIONS, type Occasion } from '../../types'

interface Props {
  selected?: Occasion
  /** Called with undefined when the selected occasion is tapped again. */
  onChange: (occasion: Occasion | undefined) => void
}

export function OccasionPicker({ selected, onChange }: Props) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">What&rsquo;s the occasion?</legend>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {OCCASIONS.map((occasion) => {
          const isSelected = occasion === selected
          const { label, emoji } = OCCASION_META[occasion]
          return (
            <button
              key={occasion}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(isSelected ? undefined : occasion)}
              className={`flex min-h-[4rem] items-center gap-3 rounded-card border-2 px-4 text-left font-semibold transition-colors ${
                isSelected
                  ? 'border-brand bg-brand-soft text-brand-dark'
                  : 'border-line bg-surface hover:bg-sand'
              }`}
            >
              <span aria-hidden="true" className="text-2xl">
                {emoji}
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
