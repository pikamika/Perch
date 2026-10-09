import { PURPOSE_META } from '../../lib/purposes'
import { PURPOSES, type Purpose } from '../../types'

interface Props {
  selected?: Purpose
  /** Called with undefined when the selected purpose is tapped again. */
  onChange: (purpose: Purpose | undefined) => void
}

/** Round emoji tiles in a row, like the specialty shortcuts on a food-delivery app. */
export function PurposePicker({ selected, onChange }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">What are you here to do?</legend>
      <div className="flex justify-between gap-2 md:justify-start md:gap-6">
        {PURPOSES.map((purpose) => {
          const isSelected = purpose === selected
          const { label, emoji } = PURPOSE_META[purpose]
          return (
            <button
              key={purpose}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(isSelected ? undefined : purpose)}
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
