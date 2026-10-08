import type { Occasion } from './restaurant'

export interface SavedPlace {
  id: string
  /** Set when saved from a confidence card; absent for places added by link. */
  restaurantId?: string
  name: string
  sourceUrl?: string
  occasions: Occasion[]
  /** ISO timestamp. */
  savedAt: string
}

export interface SavePlaceInput {
  restaurantId?: string
  name: string
  sourceUrl?: string
  occasions?: Occasion[]
}
