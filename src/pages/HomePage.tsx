import { useSearchParams } from 'react-router-dom'
import { BUDGET_MAX, BUDGET_MIN, BudgetSlider } from '../components/home/BudgetSlider'
import { OccasionPicker } from '../components/home/OccasionPicker'
import { PicksSkeleton } from '../components/home/PicksSkeleton'
import { PageHeader } from '../components/layout/PageHeader'
import { RestaurantCardCompact } from '../components/restaurant/RestaurantCardCompact'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRestaurants } from '../hooks/useRestaurants'
import { OCCASION_META, parseOccasion } from '../lib/occasions'
import type { Occasion } from '../types'

const PICK_COUNT = 3

function parseBudget(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n >= BUDGET_MIN && n < BUDGET_MAX ? n : undefined
}

export function HomePage() {
  useDocumentTitle('Where to?')
  const [params, setParams] = useSearchParams()
  const occasion = parseOccasion(params.get('occasion'))
  const maxSpend = parseBudget(params.get('budget'))

  const { state, reload } = useRestaurants({ occasion, maxSpend })

  function update(next: { occasion?: Occasion; budget?: number }) {
    const nextParams = new URLSearchParams()
    if (next.occasion) nextParams.set('occasion', next.occasion)
    if (next.budget !== undefined) nextParams.set('budget', String(next.budget))
    setParams(nextParams, { replace: true })
  }

  const heading = occasion ? `Your top ${PICK_COUNT} for ${OCCASION_META[occasion].label.toLowerCase()}` : `Your top ${PICK_COUNT} right now`

  return (
    <div>
      <PageHeader title="Where to?" subtitle="Pick the moment. We'll narrow it down to three." />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-end">
        <OccasionPicker selected={occasion} onChange={(o) => update({ occasion: o, budget: maxSpend })} />
        <BudgetSlider value={maxSpend} onChange={(b) => update({ occasion, budget: b })} />
      </div>

      <section aria-labelledby="picks-heading" className="mt-8">
        <h2 id="picks-heading" className="mb-4 font-display text-title">
          {heading}
        </h2>

        {state.status === 'loading' && <PicksSkeleton />}

        {state.status === 'error' && <ErrorState message="We couldn't load your picks." onRetry={reload} />}

        {state.status === 'success' && state.data.length === 0 && (
          <EmptyState
            title="Nothing fits that budget"
            description="No spots match this combination yet. Try a higher budget or a different occasion."
            action={
              <Button onClick={() => update({ occasion })} variant="secondary">
                Show any budget
              </Button>
            }
          />
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-3">
            {state.data.slice(0, PICK_COUNT).map((restaurant) => (
              <li key={restaurant.id}>
                <RestaurantCardCompact restaurant={restaurant} occasion={occasion} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
