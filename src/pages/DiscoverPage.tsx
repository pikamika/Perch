import { Link, useSearchParams } from 'react-router-dom'
import { BUDGET_MAX, BUDGET_MIN, BudgetSlider } from '../components/discover/BudgetSlider'
import { OccasionPicker } from '../components/discover/OccasionPicker'
import { RestaurantRow } from '../components/discover/RestaurantRow'
import { RowSkeleton } from '../components/discover/RowSkeleton'
import { Avatar } from '../components/profile/Avatar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { useCollections } from '../hooks/useCollections'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProfile } from '../hooks/useProfile'
import { useRestaurants } from '../hooks/useRestaurants'
import { filterRestaurants } from '../lib/filterRestaurants'
import { OCCASION_META, parseOccasion } from '../lib/occasions'
import type { Occasion } from '../types'

const PICK_COUNT = 3

function parseBudget(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n >= BUDGET_MIN && n < BUDGET_MAX ? n : undefined
}

export function DiscoverPage() {
  useDocumentTitle('Discover')
  const { profile } = useProfile()
  const [params, setParams] = useSearchParams()
  const occasion = parseOccasion(params.get('occasion'))
  const maxSpend = parseBudget(params.get('budget'))

  const picks = useRestaurants({ occasion, maxSpend })
  const collections = useCollections()

  function update(next: { occasion?: Occasion; budget?: number }) {
    const nextParams = new URLSearchParams()
    if (next.occasion) nextParams.set('occasion', next.occasion)
    if (next.budget !== undefined) nextParams.set('budget', String(next.budget))
    setParams(nextParams, { replace: true })
  }

  const picksTitle = occasion
    ? `Top ${PICK_COUNT} for ${OCCASION_META[occasion].label.toLowerCase()}`
    : `Your top ${PICK_COUNT} right now`

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {profile?.city ? <p className="truncate text-caption font-semibold text-ink-muted">📍 {profile.city}</p> : null}
          <h1 className="truncate font-display text-display">Hi {profile?.firstName ?? 'there'}</h1>
          <p className="text-ink-muted">Where are we eating?</p>
        </div>
        {profile ? (
          <Link
            to="/account"
            aria-label="Your account"
            className="flex h-touch w-touch shrink-0 items-center justify-center rounded-full"
          >
            <Avatar emoji={profile.avatarEmoji} color={profile.avatarColor} />
          </Link>
        ) : null}
      </header>

      <div className="space-y-5">
        <OccasionPicker selected={occasion} onChange={(o) => update({ occasion: o, budget: maxSpend })} />
        <BudgetSlider value={maxSpend} onChange={(b) => update({ occasion, budget: b })} />
      </div>

      <section aria-labelledby="picks-heading">
        {picks.state.status === 'loading' && <RowSkeleton label="Finding your picks" />}

        {picks.state.status === 'error' && (
          <ErrorState message="We couldn't load your picks." onRetry={picks.reload} />
        )}

        {picks.state.status === 'success' && picks.state.data.length === 0 && (
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

        {picks.state.status === 'success' && picks.state.data.length > 0 && (
          <RestaurantRow
            title={picksTitle}
            subtitle="Matched to your occasion and budget"
            restaurants={picks.state.data.slice(0, PICK_COUNT)}
            occasion={occasion}
          />
        )}
      </section>

      {collections.state.status === 'loading' && (
        <>
          <RowSkeleton label="Loading more places" />
          <RowSkeleton label="Loading more places" />
        </>
      )}

      {collections.state.status === 'error' && (
        <ErrorState message="We couldn't load more places to explore." onRetry={collections.reload} />
      )}

      {collections.state.status === 'success' &&
        collections.state.data.map((collection) => {
          const restaurants = filterRestaurants(collection.restaurants, { occasion, maxSpend })
          if (restaurants.length === 0) return null
          return (
            <RestaurantRow
              key={collection.id}
              title={collection.title}
              subtitle={collection.subtitle}
              restaurants={restaurants}
              occasion={occasion}
            />
          )
        })}
    </div>
  )
}
