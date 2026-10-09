import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BackButton } from '../components/layout/BackButton'
import { FreshnessBadge } from '../components/cafe/FreshnessBadge'
import { PurposeChips } from '../components/cafe/PurposeChips'
import { PhotoStrip } from '../components/cafe/PhotoStrip'
import { PriceBadge } from '../components/cafe/PriceBadge'
import { WorkCheck } from '../components/cafe/WorkCheck'
import { WorkVerdictBadge } from '../components/cafe/WorkVerdictBadge'
import { CafeSkeleton } from '../components/cafe/CafeSkeleton'
import { SaveButton } from '../components/cafe/SaveButton'
import { WhatToOrder } from '../components/cafe/WhatToOrder'
import { ButtonLink } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { ExternalIcon } from '../components/ui/icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useCafe } from '../hooks/useCafe'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { parsePurpose } from '../lib/purposes'
import { NotFoundError } from '../services'
import type { Purpose, Cafe } from '../types'

export function CafePage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const purpose = parsePurpose(params.get('purpose'))
  const { state, reload } = useCafe(id)

  const title = state.status === 'success' ? state.data.name : 'Cafe'
  useDocumentTitle(title)

  return (
    <div>
      <BackButton />
      {state.status === 'loading' && <CafeSkeleton />}

      {state.status === 'error' &&
        (state.error instanceof NotFoundError ? (
          <EmptyState
            title="We couldn't find that place"
            description="It may have been removed. Head back to Home to pick another."
            action={<ButtonLink to="/">Back to Discover</ButtonLink>}
          />
        ) : (
          <ErrorState message="We couldn't load this cafe." onRetry={reload} />
        ))}

      {state.status === 'success' && <CafeDetails cafe={state.data} purpose={purpose} />}
    </div>
  )
}

function CafeDetails({ cafe, purpose }: { cafe: Cafe; purpose?: Purpose }) {
  return (
    <article className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-8">
      <div className="lg:sticky lg:top-6">
        <PhotoStrip photos={cafe.photos} name={cafe.name} />
      </div>

      <div className="mt-5 space-y-6 lg:mt-0">
        <header className="space-y-2">
          <h1 className="font-display text-display">{cafe.name}</h1>
          <p className="text-lead text-ink-muted">
            {cafe.neighborhood} · {cafe.specialty}
            {cafe.chainName ? ` · ${cafe.chainName}` : ''}
          </p>
          <WorkVerdictBadge cafe={cafe} />
        </header>

        <WorkCheck cafe={cafe} />

        <section aria-labelledby="best-for-heading" className="space-y-2">
          <h2 id="best-for-heading" className="font-semibold">
            Best for
          </h2>
          <PurposeChips bestFor={cafe.bestFor} highlight={purpose} />
        </section>

        <WhatToOrder dishes={cafe.whatToOrder} />

        <section aria-labelledby="cost-heading" className="rounded-card bg-surface p-4 shadow-card">
          <h2 id="cost-heading" className="mb-1 font-semibold">
            What it costs
          </h2>
          <div className="text-lead">
            <PriceBadge cafe={cafe} />
          </div>
        </section>

        <section aria-labelledby="vibe-heading" className="space-y-2">
          <h2 id="vibe-heading" className="font-semibold">
            Vibe
          </h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Chip>{cafe.lighting} lighting</Chip>
            </li>
            {cafe.vibeTags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
          <FreshnessBadge photosUpdatedAt={cafe.photosUpdatedAt} />
        </section>

        <div className="space-y-3">
          <SaveControls cafe={cafe} />
          {cafe.sourceUrl ? (
            <a
              href={cafe.sourceUrl}
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
function SaveControls({ cafe }: { cafe: Cafe }) {
  const { state: savedState, reload: reloadSaved, save, remove } = useSavedPlaces()
  const [pending, setPending] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const savedEntry =
    savedState.status === 'success' ? savedState.data.find((p) => p.cafeId === cafe.id) : undefined

  async function toggleSaved() {
    setPending(true)
    setSaveError(null)
    try {
      if (savedEntry) {
        await remove(savedEntry.id)
      } else {
        await save({
          cafeId: cafe.id,
          name: cafe.name,
          sourceUrl: cafe.sourceUrl,
          purposes: cafe.bestFor,
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
