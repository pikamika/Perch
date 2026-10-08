import type { Occasion } from './restaurant'

export interface RestaurantFilters {
  occasion?: Occasion
  /** Maximum typical spend per person in USD. */
  maxSpend?: number
}
