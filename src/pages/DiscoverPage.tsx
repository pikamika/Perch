import { Link, useSearchParams } from 'react-router-dom'
import { BUDGET_MAX, BUDGET_MIN, BudgetSlider } from '../components/discover/BudgetSlider'
import { CafeRow } from '../components/discover/CafeRow'
import { NeedsFilter } from '../components/discover/NeedsFilter'
import { PurposePicker } from '../components/discover/PurposePicker'
import { RowSkeleton } from '../components/discover/RowSkeleton'
import { Avatar } from '../components/profile/Avatar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { useCafes } from '../hooks/useCafes'
import { useCollections } from '../hooks/useCollections'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProfile } from '../hooks/useProfile'
import { filterCafes } from '../lib/filterCafes'
import { PURPOSE_META, parsePurpose } from '../lib/purposes'
import { parseNeeds } from '../lib/work'
import type { Need, Purpose } from '../types'

const PICK_COUNT = 3

function parseBudget(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n >= BUDGET_MIN && n < BUDGET_MAX ? n : undefined
}

interface FilterState {
  purpose?: Purpose
  budget?: number
  needs: Need[]
}

export function DiscoverPage() {
  useDocumentTitle('Discover')
  const { profile } = useProfile()
  const [params, setParams] = useSearchParams()
  const purpose = parsePurpose(params.get('purpose'))
  const maxSpend = parseBudget(params.get('budget'))
  const needs = parseNeeds(params.get('needs'))

  const picks = useCafes({ purpose, maxSpend, needs })
  const collections = useCollections()

  function update(next: FilterState) {
    const nextParams = new URLSearchParams()
    if (next.purpose) nextParams.set('purpose', next.purpose)
    if (next.budget !== undefined) nextParams.set('budget', String(next.budget))
    if (next.needs.length > 0) nextParams.set('needs', next.needs.join(','))
    setParams(nextParams, { replace: true })
  }

  const current: FilterState = { purpose, budget: maxSpend, needs }
  const picksTitle = purpose
    ? `Top ${PICK_COUNT} for ${PURPOSE_META[purpose].label.toLowerCase()}`
    : `Your top ${PICK_COUNT} to work from`

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {profile?.city ? <p className="truncate text-caption font-semibold text-ink-muted">📍 {profile.city}</p> : null}
          <h1 className="truncate font-display text-display">Hi {profile?.firstName ?? 'there'}</h1>
          <p className="text-ink-muted">Where are you working today?</p>
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
        <PurposePicker selected={purpose} onChange={(p) => update({ ...current, purpose: p })} />
        <NeedsFilter selected={needs} onChange={(n) => update({ ...current, needs: n })} />
        <BudgetSlider value={maxSpend} onChange={(b) => update({ ...current, budget: b })} />
      </div>

      <div>
        {picks.state.status === 'loading' && <RowSkeleton label="Finding your picks" />}

        {picks.state.status === 'error' && (
          <ErrorState message="We couldn't load your picks." onRetry={picks.reload} />
        )}

        {picks.state.status === 'success' && picks.state.data.length === 0 && (
          <EmptyState
            title="No cafe checks every box"
            description="Nothing matches all of that yet. Loosen a must-have or raise your budget to see more."
            action={
              <Button onClick={() => update({ purpose, needs: [] })} variant="secondary">
                Clear must-haves and budget
              </Button>
            }
          />
        )}

        {picks.state.status === 'success' && picks.state.data.length > 0 && (
          <CafeRow
            title={picksTitle}
            subtitle="The best match for what you picked"
            cafes={picks.state.data.slice(0, PICK_COUNT)}
            purpose={purpose}
          />
        )}
      </div>

      {collections.state.status === 'loading' && (
        <>
          <RowSkeleton label="Loading more cafes" />
          <RowSkeleton label="Loading more cafes" />
        </>
      )}

      {collections.state.status === 'error' && (
        <ErrorState message="We couldn't load more cafes to explore." onRetry={collections.reload} />
      )}

      {collections.state.status === 'success' &&
        collections.state.data.map((collection) => {
          const cafes = filterCafes(collection.cafes, { purpose, maxSpend, needs })
          if (cafes.length === 0) return null
          return (
            <CafeRow
              key={collection.id}
              title={collection.title}
              subtitle={collection.subtitle}
              cafes={cafes}
              purpose={purpose}
            />
          )
        })}
    </div>
  )
}
