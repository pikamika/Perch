import { NEED_META } from '../../lib/work'
import { NEEDS, type Need } from '../../types'

interface Props {
  selected: Need[]
  onChange: (needs: Need[]) => void
}

/** Must-haves a cafe has to meet: toggle as many as you like. */
export function NeedsFilter({ selected, onChange }: Props) {
  function toggle(need: Need) {
    onChange(selected.includes(need) ? selected.filter((n) => n !== need) : [...selected, need])
  }

  return (
    <fieldset>
      <legend className="mb-2 font-semibold">Must-haves</legend>
      <div className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NEEDS.map((need) => {
          const isOn = selected.includes(need)
          const { label, emoji } = NEED_META[need]
          return (
            <button
              key={need}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(need)}
              className={`flex min-h-touch shrink-0 items-center gap-2 rounded-full border-2 px-4 font-semibold transition-colors ${
                isOn ? 'border-brand bg-brand text-white' : 'border-line bg-surface hover:bg-sand'
              }`}
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
