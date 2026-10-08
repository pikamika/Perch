import { mockRestaurants } from '../../data/mockRestaurants'
import type { Restaurant, RestaurantFilters } from '../../types'
import { NotFoundError, type RestaurantService } from '../restaurantService'
import { simulateNetwork } from './delay'

function matches(restaurant: Restaurant, filters: RestaurantFilters): boolean {
  if (filters.occasion && !restaurant.bestFor.includes(filters.occasion)) return false
  if (filters.maxSpend !== undefined && restaurant.typicalSpendPerPerson > filters.maxSpend) return false
  return true
}

export const mockRestaurantService: RestaurantService = {
  async listRestaurants(filters = {}) {
    await simulateNetwork()
    // Ranking: freshest photos first (a stand-in for a real "best match" score).
    return mockRestaurants
      .filter((r) => matches(r, filters))
      .sort((a, b) => b.photosUpdatedAt.localeCompare(a.photosUpdatedAt))
  },

  async getRestaurant(id) {
    await simulateNetwork()
    const found = mockRestaurants.find((r) => r.id === id)
    if (!found) throw new NotFoundError(`No restaurant with id "${id}"`)
    return found
  },
}
