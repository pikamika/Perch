import type { Restaurant, RestaurantFilters } from '../types'

/** Applies the Discover occasion / budget filters to a list that is already loaded. */
export function filterRestaurants(restaurants: Restaurant[], filters: RestaurantFilters): Restaurant[] {
  return restaurants.filter(
    (r) =>
      (!filters.occasion || r.bestFor.includes(filters.occasion)) &&
      (filters.maxSpend === undefined || r.typicalSpendPerPerson <= filters.maxSpend),
  )
}
