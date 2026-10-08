import { getSupabase } from '../../lib/supabaseClient'
import { NotFoundError, type RestaurantService } from '../restaurantService'
import { toRestaurant } from './mappers'

// Postgres error code for "invalid input syntax" (e.g. an id that is not a uuid).
const INVALID_TEXT_REPRESENTATION = '22P02'

export const supabaseRestaurantService: RestaurantService = {
  async listRestaurants(filters = {}) {
    let query = getSupabase().from('restaurants').select('*')
    if (filters.occasion) query = query.contains('best_for', [filters.occasion])
    if (filters.maxSpend !== undefined) query = query.lte('typical_spend_per_person', filters.maxSpend)

    // Same ranking as the mock: freshest photos first (name breaks ties).
    const { data, error } = await query
      .order('photos_updated_at', { ascending: false })
      .order('name', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map(toRestaurant)
  },

  async getRestaurant(id) {
    const { data, error } = await getSupabase().from('restaurants').select('*').eq('id', id).maybeSingle()
    if (error) {
      if (error.code === INVALID_TEXT_REPRESENTATION) throw new NotFoundError(`No restaurant with id "${id}"`)
      throw new Error(error.message)
    }
    if (!data) throw new NotFoundError(`No restaurant with id "${id}"`)
    return toRestaurant(data)
  },
}
