import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { OccasionFilter } from '../components/saved/OccasionFilter'
import { SavedItem } from '../components/saved/SavedItem'
import { SavedSkeleton } from '../components/saved/SavedSkeleton'
import { Button, ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { BookmarkIcon } from '../components/ui/icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRestaurants } from '../hooks/useRestaurants'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { OCCASION_META } from '../lib/occasions'
import type { Occasion, Restaurant, SavedPlace } from '../types'

export function SavedPage() {
  useDocumentTitle('Saved')
  const { state, reload, remove } = useSavedPlaces()
  // Used only to show photos / neighborhood for places saved from a confidence card.
  const { state: restaurantsState } = useRestaurants()
  const [filter, setFilter] = useState<Occasion | undefined>(undefined)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  const restaurants = restaurantsState.status === 'success' ? restaurantsState.data : []

  async function handleRemove(place: SavedPlace) {
    setRemovingId(place.id)
    setRemoveError(null)
    try {
      await remove(place.id)
    } catch {
      setRemoveError(`We couldn’t remove ${place.name}. Please try again.`)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Saved" subtitle="Your shortlist, ready for the next plan." />

      {state.status === 'loading' && <SavedSkeleton />}

      {state.status === 'error' && <ErrorState message="We couldn't load your saved places." onRetry={reload} />}

      {state.status === 'success' && state.data.length === 0 && (
        <EmptyState
          icon={<BookmarkIcon width={40} height={40} />}
          title="Nothing saved yet"
          description="Save places from their confidence card, or add one from a TikTok, Instagram or Google Maps link."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink to="/">Find a spot</ButtonLink>
              <ButtonLink to="/add" variant="secondary">
                Add a place
              </ButtonLink>
            </div>
          }
        />
      )}

      {state.status === 'success' && state.data.length > 0 && (
        <SavedList
          places={state.data}
          restaurants={restaurants}
          filter={filter}
          onFilterChange={setFilter}
          removingId={removingId}
          removeError={removeError}
          onRemove={handleRemove}
        />
      )}
    </div>
  )
}

interface SavedListProps {
  places: SavedPlace[]
  restaurants: Restaurant[]
  filter?: Occasion
  onFilterChange: (occasion: Occasion | undefined) => void
  removingId: string | null
  removeError: string | null
  onRemove: (place: SavedPlace) => void
}

function SavedList({ places, restaurants, filter, onFilterChange, removingId, removeError, onRemove }: SavedListProps) {
  const visible = filter ? places.filter((p) => p.occasions.includes(filter)) : places

  return (
    <>
      <OccasionFilter selected={filter} onChange={onFilterChange} />

      {removeError ? (
        <p role="alert" className="mt-3 font-semibold text-danger">
          {removeError}
        </p>
      ) : null}

      {visible.length === 0 && filter ? (
        <div className="mt-4">
          <EmptyState
            title={`Nothing saved for ${OCCASION_META[filter].label.toLowerCase()}`}
            description="Try another occasion, or show everything you've saved."
            action={
              <Button variant="secondary" onClick={() => onFilterChange(undefined)}>
                Show all
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {visible.map((place) => (
            <SavedItem
              key={place.id}
              place={place}
              restaurant={restaurants.find((r) => r.id === place.restaurantId)}
              removing={removingId === place.id}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </>
  )
}
