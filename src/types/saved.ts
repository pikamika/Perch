import type { Purpose } from './cafe'

export interface SavedPlace {
  id: string
  /** Set when saved from a cafe page; absent for places added by link. */
  cafeId?: string
  name: string
  sourceUrl?: string
  purposes: Purpose[]
  /** ISO timestamp. */
  savedAt: string
}

export interface SavePlaceInput {
  cafeId?: string
  name: string
  sourceUrl?: string
  purposes?: Purpose[]
}
