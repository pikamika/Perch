import { getSupabase } from '../../lib/supabaseClient'
import type { CollectionService } from '../collectionService'
import { toCollection } from './mappers'

export const supabaseCollectionService: CollectionService = {
  async listCollections() {
    const { data, error } = await getSupabase()
      .from('collections')
      .select('id, title, subtitle, sort_order, collection_cafes(position, cafe:cafes(*))')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map(toCollection)
  },
}
