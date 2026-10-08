import { useCallback } from 'react'
import { savedPlaceService } from '../services'
import type { SavePlaceInput, SavedPlace } from '../types'
import { useAsync } from './useAsync'

export function useSavedPlaces() {
  const { state, reload, setData } = useAsync('saved', () => savedPlaceService.listSavedPlaces())

  const save = useCallback(
    async (input: SavePlaceInput): Promise<SavedPlace> => {
      const place = await savedPlaceService.savePlace(input)
      setData((list) => (list.some((p) => p.id === place.id) ? list : [place, ...list]))
      return place
    },
    [setData],
  )

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await savedPlaceService.removeSavedPlace(id)
      setData((list) => list.filter((p) => p.id !== id))
    },
    [setData],
  )

  return { state, reload, save, remove }
}
