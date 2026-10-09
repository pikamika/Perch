import { mockCollections } from '../../data/mockCollections'
import { mockCafes } from '../../data/mockCafes'
import type { Collection, Cafe } from '../../types'
import type { CollectionService } from '../collectionService'
import { simulateNetwork } from './delay'

export const mockCollectionService: CollectionService = {
  async listCollections() {
    await simulateNetwork()
    return mockCollections.map((c): Collection => {
      const cafes = c.cafeIds
        .map((id) => mockCafes.find((r) => r.id === id))
        .filter((r): r is Cafe => r !== undefined)
      return { id: c.id, title: c.title, subtitle: c.subtitle, cafes }
    })
  },
}
