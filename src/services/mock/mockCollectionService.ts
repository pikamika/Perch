import { mockCollections } from '../../data/mockCollections'
import { mockRestaurants } from '../../data/mockRestaurants'
import type { Collection, Restaurant } from '../../types'
import type { CollectionService } from '../collectionService'
import { simulateNetwork } from './delay'

export const mockCollectionService: CollectionService = {
  async listCollections() {
    await simulateNetwork()
    return mockCollections.map((c): Collection => {
      const restaurants = c.restaurantIds
        .map((id) => mockRestaurants.find((r) => r.id === id))
        .filter((r): r is Restaurant => r !== undefined)
      return { id: c.id, title: c.title, subtitle: c.subtitle, restaurants }
    })
  },
}
