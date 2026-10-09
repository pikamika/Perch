import { OCCASION_META } from '../../lib/occasions'
import { OCCASIONS, type Occasion } from '../../types'

interface Props {
  selected?: Occasion
  /** Called with undefined when the selected occasion is tapped again. */
  onChange: (occasion: Occasion | undefined) => void
}

/** Round emoji tiles in a row, like the cuisine shortcuts on a food-delivery app. */
export function OccasionPicker({ selected, onChange }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">What&rsquo;s the occasion?</legend>
      <div className="flex justify-between gap-2 md:justify-start md:gap-6">
        {OCCASIONS.map((occasion) => {
          const isSelected = occasion === selected
          const { label, emoji } = OCCASION_META[occasion]
          return (
            <button
              key={occasion}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(isSelected ? undefined : occasion)}
              className="flex min-h-touch w-[4.75rem] flex-col items-center gap-1.5 rounded-card py-1"
            >
              <span
                aria-hidden="true"
                className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-colors ${
                  isSelected ? 'bg-brand ring-2 ring-brand ring-offset-2 ring-offset-cream' : 'bg-sand'
                }`}
              >
                {emoji}
              </span>
              <span className={`text-caption font-semibold ${isSelected ? 'text-brand-dark' : 'text-ink'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
