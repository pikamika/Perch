import type { SavePlaceInput, SavedPlace } from '../types'

export interface SavedPlaceService {
  /** Newest first. */
  listSavedPlaces(): Promise<SavedPlace[]>
  /** Saving the same restaurantId twice returns the existing entry. */
  savePlace(input: SavePlaceInput): Promise<SavedPlace>
  removeSavedPlace(id: string): Promise<void>
}
