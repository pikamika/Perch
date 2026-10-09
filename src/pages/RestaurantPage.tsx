import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BackButton } from '../components/layout/BackButton'
import { FreshnessBadge } from '../components/restaurant/FreshnessBadge'
import { OccasionChips } from '../components/restaurant/OccasionChips'
import { PhotoStrip } from '../components/restaurant/PhotoStrip'
import { PriceBadge } from '../components/restaurant/PriceBadge'
import { RestaurantSkeleton } from '../components/restaurant/RestaurantSkeleton'
import { SaveButton } from '../components/restaurant/SaveButton'
import { WhatToOrder } from '../components/restaurant/WhatToOrder'
import { ButtonLink } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { ExternalIcon } from '../components/ui/icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRestaurant } from '../hooks/useRestaurant'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { parseOccasion } from '../lib/occasions'
import { NotFoundError } from '../services'
import type { Occasion, Restaurant } from '../types'

export function RestaurantPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const occasion = parseOccasion(params.get('occasion'))
  const { state, reload } = useRestaurant(id)

  const title = state.status === 'success' ? state.data.name : 'Restaurant'
  useDocumentTitle(title)

  return (
    <div>
      <BackButton />
      {state.status === 'loading' && <RestaurantSkeleton />}

      {state.status === 'error' &&
        (state.error instanceof NotFoundError ? (
          <EmptyState
            title="We couldn't find that place"
            description="It may have been removed. Head back to Home to pick another."
            action={<ButtonLink to="/">Back to Discover</ButtonLink>}
          />
        ) : (
          <ErrorState message="We couldn't load this restaurant." onRetry={reload} />
        ))}

      {state.status === 'success' && <ConfidenceCard restaurant={state.data} occasion={occasion} />}
    </div>
  )
}

function ConfidenceCard({ restaurant, occasion }: { restaurant: Restaurant; occasion?: Occasion }) {
  return (
    <article className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-8">
      <div className="lg:sticky lg:top-6">
        <PhotoStrip photos={restaurant.photos} name={restaurant.name} />
      </div>

      <div className="mt-5 space-y-6 lg:mt-0">
        <header>
          <h1 className="font-display text-display">{restaurant.name}</h1>
          <p className="mt-1 text-lead text-ink-muted">
            {restaurant.neighborhood} · {restaurant.cuisine}
          </p>
        </header>

        <section aria-labelledby="best-for-heading" className="space-y-2">
          <h2 id="best-for-heading" className="font-semibold">
            Best for
          </h2>
          <OccasionChips bestFor={restaurant.bestFor} highlight={occasion} />
        </section>

        <section aria-labelledby="cost-heading" className="rounded-card bg-surface p-4 shadow-card">
          <h2 id="cost-heading" className="mb-1 font-semibold">
            Cost
          </h2>
          <div className="text-lead">
            <PriceBadge restaurant={restaurant} />
          </div>
        </section>

        <WhatToOrder dishes={restaurant.whatToOrder} />

        <section aria-labelledby="vibe-heading" className="space-y-2">
          <h2 id="vibe-heading" className="font-semibold">
            Vibe
          </h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Chip>{restaurant.lighting} lighting</Chip>
            </li>
            {restaurant.vibeTags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
          <FreshnessBadge photosUpdatedAt={restaurant.photosUpdatedAt} />
        </section>

        <div className="space-y-3">
          <SaveControls restaurant={restaurant} />
          {restaurant.sourceUrl ? (
            <a
              href={restaurant.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-touch items-center gap-2 font-semibold text-brand-dark underline"
            >
              View original post
              <ExternalIcon width={18} height={18} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/** Save / unsave button for the signed-in user. */
function SaveControls({ restaurant }: { restaurant: Restaurant }) {
  const { state: savedState, reload: reloadSaved, save, remove } = useSavedPlaces()
  const [pending, setPending] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const savedEntry =
    savedState.status === 'success' ? savedState.data.find((p) => p.restaurantId === restaurant.id) : undefined

  async function toggleSaved() {
    setPending(true)
    setSaveError(null)
    try {
      if (savedEntry) {
        await remove(savedEntry.id)
      } else {
        await save({
          restaurantId: restaurant.id,
          name: restaurant.name,
          sourceUrl: restaurant.sourceUrl,
          occasions: restaurant.bestFor,
        })
      }
    } catch {
      setSaveError('We couldn’t update your saved places. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <SaveButton
        saved={savedEntry !== undefined}
        pending={pending}
        disabled={savedState.status !== 'success'}
        onToggle={toggleSaved}
      />
      {saveError ? (
        <p role="alert" className="text-caption font-semibold text-danger">
          {saveError}
        </p>
      ) : null}
      {savedState.status === 'error' ? (
        <p role="alert" className="text-caption text-danger">
          Couldn&rsquo;t check your saved places.{' '}
          <button type="button" onClick={reloadSaved} className="font-semibold underline">
            Retry
          </button>
        </p>
      ) : null}
    </>
  )
}
