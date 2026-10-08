import { restaurantService } from '../services'
import type { RestaurantFilters } from '../types'
import { useAsync } from './useAsync'

export function useRestaurants(filters: RestaurantFilters = {}) {
  const key = JSON.stringify(filters)
  return useAsync(`restaurants:${key}`, () => restaurantService.listRestaurants(filters))
}
