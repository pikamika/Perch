import { getSupabase } from '../../lib/supabaseClient'
import type { SavedPlaceService } from '../savedPlaceService'
import { toSavedPlace } from './mappers'

// Postgres error code for a unique constraint violation.
const UNIQUE_VIOLATION = '23505'

// Row level security limits every query to the signed-in user's own rows, and the
// user_id column fills itself from the session, so no user id is passed from here.
export const supabaseSavedPlaceService: SavedPlaceService = {
  async listSavedPlaces() {
    const { data, error } = await getSupabase()
      .from('saved_places')
      .select('*')
      .order('saved_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(toSavedPlace)
  },

  async savePlace(input) {
    const supabase = getSupabase()

    async function findExisting() {
      if (!input.cafeId) return undefined
      const { data, error } = await supabase
        .from('saved_places')
        .select('*')
        .eq('cafe_id', input.cafeId)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data ? toSavedPlace(data) : undefined
    }

    const existing = await findExisting()
    if (existing) return existing

    const { data, error } = await supabase
      .from('saved_places')
      .insert({
        cafe_id: input.cafeId ?? null,
        name: input.name,
        source_url: input.sourceUrl ?? null,
        purposes: input.purposes ?? [],
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
    const { error } = await getSupabase().from('saved_places').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
