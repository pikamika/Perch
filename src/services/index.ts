/**
 * The ONLY place that decides which implementation the app uses.
 * To connect Supabase, point these two exports at the Supabase services instead.
 */
import { mockRestaurantService } from './mock/mockRestaurantService'
import { mockSavedPlaceService } from './mock/mockSavedPlaceService'
import type { RestaurantService } from './restaurantService'
import type { SavedPlaceService } from './savedPlaceService'

export const restaurantService: RestaurantService = mockRestaurantService
export const savedPlaceService: SavedPlaceService = mockSavedPlaceService

export { NotFoundError } from './restaurantService'
export type { RestaurantService } from './restaurantService'
export type { SavedPlaceService } from './savedPlaceService'
