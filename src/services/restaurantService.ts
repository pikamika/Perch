import type { Restaurant, RestaurantFilters } from '../types'

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export interface RestaurantService {
  /** Returns restaurants matching the filters, best matches first. */
  listRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]>
  /** Rejects with NotFoundError when the id does not exist. */
  getRestaurant(id: string): Promise<Restaurant>
}
