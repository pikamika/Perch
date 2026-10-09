import { filterCafes, rankCafes } from '../../lib/filterCafes'
import { getSupabase } from '../../lib/supabaseClient'
import { NotFoundError, type CafeService } from '../cafeService'
import { toCafe } from './mappers'

// Postgres error code for "invalid input syntax" (e.g. an id that is not a uuid).
const INVALID_TEXT_REPRESENTATION = '22P02'

export const supabaseCafeService: CafeService = {
  async listCafes(filters = {}) {
    let query = getSupabase().from('cafes').select('*')
    if (filters.purpose) query = query.contains('best_for', [filters.purpose])
    if (filters.maxSpend !== undefined) query = query.lte('typical_spend_per_person', filters.maxSpend)

    const { data, error } = await query
    if (error) throw new Error(error.message)

    // Must-haves and "best to work from" ranking use the same rules as the mock service.
    const cafes = data.map(toCafe)
    return rankCafes(filterCafes(cafes, { needs: filters.needs }), filters.purpose)
  },

  async getCafe(id) {
    const { data, error } = await getSupabase().from('cafes').select('*').eq('id', id).maybeSingle()
    if (error) {
      if (error.code === INVALID_TEXT_REPRESENTATION) throw new NotFoundError(`No cafe with id "${id}"`)
      throw new Error(error.message)
    }
    if (!data) throw new NotFoundError(`No cafe with id "${id}"`)
    return toCafe(data)
  },
}
