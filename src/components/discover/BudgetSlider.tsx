import { useEffect, useRef, useState } from 'react'

export const BUDGET_MIN = 5
export const BUDGET_MAX = 25 // the right-most stop means "any budget"
const STEP = 1

interface Props {
  /** Max spend for a drink plus a snack, in USD; undefined means any budget. */
  value?: number
  onChange: (maxSpend: number | undefined) => void
}

export function BudgetSlider({ value, onChange }: Props) {
  // While dragging we show the draft value and commit to the parent after a short pause.
  const [draft, setDraft] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const shown = draft ?? value ?? BUDGET_MAX
  const isAny = shown >= BUDGET_MAX
  const text = isAny ? 'Any budget' : `Up to $${shown} for a drink + snack`

  function handleChange(next: number) {
    setDraft(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      onChange(next >= BUDGET_MAX ? undefined : next)
      setDraft(null)
    }, 250)
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor="budget" className="font-semibold">
          Budget <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <output htmlFor="budget" className="font-semibold text-brand-dark">
          {text}
        </output>
      </div>
      <input
        id="budget"
        type="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={STEP}
        value={shown}
        aria-valuetext={text}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="h-touch w-full cursor-pointer accent-brand"
      />
      <div className="flex justify-between text-caption text-ink-muted" aria-hidden="true">
        <span>${BUDGET_MIN}</span>
        <span>Any</span>
      </div>
    </div>
  )
}
