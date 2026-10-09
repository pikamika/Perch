/**
 * The ONLY place that decides which implementation the app uses.
 * With VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set (see .env.example) the app talks to
 * Supabase; without them it falls back to the local mock data so the prototype still runs.
 */
import { isSupabaseConfigured } from '../lib/supabaseClient'
import type { AuthService } from './authService'
import type { CollectionService } from './collectionService'
import { mockAuthService } from './mock/mockAuthService'
import { mockCollectionService } from './mock/mockCollectionService'
import { mockProfileService } from './mock/mockProfileService'
import { mockRestaurantService } from './mock/mockRestaurantService'
import { mockSavedPlaceService } from './mock/mockSavedPlaceService'
import type { ProfileService } from './profileService'
import type { RestaurantService } from './restaurantService'
import type { SavedPlaceService } from './savedPlaceService'
import { supabaseAuthService } from './supabase/supabaseAuthService'
import { supabaseCollectionService } from './supabase/supabaseCollectionService'
import { supabaseProfileService } from './supabase/supabaseProfileService'
import { supabaseRestaurantService } from './supabase/supabaseRestaurantService'
import { supabaseSavedPlaceService } from './supabase/supabaseSavedPlaceService'

export const restaurantService: RestaurantService = isSupabaseConfigured
  ? supabaseRestaurantService
  : mockRestaurantService
export const savedPlaceService: SavedPlaceService = isSupabaseConfigured
  ? supabaseSavedPlaceService
  : mockSavedPlaceService
export const authService: AuthService = isSupabaseConfigured ? supabaseAuthService : mockAuthService
export const profileService: ProfileService = isSupabaseConfigured ? supabaseProfileService : mockProfileService
export const collectionService: CollectionService = isSupabaseConfigured
  ? supabaseCollectionService
  : mockCollectionService

export { AuthError } from './authService'
export type { CollectionService } from './collectionService'
export type { ProfileService } from './profileService'
export type { AuthService, AuthUser, SignUpResult } from './authService'
export { NotFoundError } from './restaurantService'
export type { RestaurantService } from './restaurantService'
export type { SavedPlaceService } from './savedPlaceService'
