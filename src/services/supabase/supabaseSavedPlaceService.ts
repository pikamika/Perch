import { getDeviceId } from '../../lib/deviceId'
import { getSupabase } from '../../lib/supabaseClient'
import type { SavedPlaceService } from '../savedPlaceService'
import { toSavedPlace } from './mappers'

// Postgres error code for a unique constraint violation.
const UNIQUE_VIOLATION = '23505'

export const supabaseSavedPlaceService: SavedPlaceService = {
  async listSavedPlaces() {
    const { data, error } = await getSupabase()
      .from('saved_places')
      .select('*')
      .eq('device_id', getDeviceId())
      .order('saved_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(toSavedPlace)
  },

  async savePlace(input) {
    const supabase = getSupabase()
    const deviceId = getDeviceId()

    async function findExisting() {
      if (!input.restaurantId) return undefined
      const { data, error } = await supabase
        .from('saved_places')
        .select('*')
        .eq('device_id', deviceId)
        .eq('restaurant_id', input.restaurantId)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data ? toSavedPlace(data) : undefined
    }

    const existing = await findExisting()
    if (existing) return existing

    const { data, error } = await supabase
      .from('saved_places')
      .insert({
        device_id: deviceId,
        restaurant_id: input.restaurantId ?? null,
        name: input.name,
        source_url: input.sourceUrl ?? null,
        occasions: input.occasions ?? [],
      })
      .select('*')
      .single()

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        // Saved from another tab a moment ago: return that row.
        const raced = await findExisting()
        if (raced) return raced
      }
      throw new Error(error.message)
    }
    return toSavedPlace(data)
  },

  async removeSavedPlace(id) {
    const { error } = await getSupabase().from('saved_places').delete().eq('id', id).eq('device_id', getDeviceId())
    if (error) throw new Error(error.message)
  },
}
