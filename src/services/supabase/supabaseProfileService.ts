import { getSupabase } from '../../lib/supabaseClient'
import type { ProfileService } from '../profileService'
import { toProfile } from './mappers'

async function currentUser() {
  const { data, error } = await getSupabase().auth.getSession()
  const user = data.session?.user
  if (error || !user) throw new Error('Not signed in')
  return user
}

// Row level security limits every query to the signed-in user's own profile row.
export const supabaseProfileService: ProfileService = {
  async getProfile() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from('profiles').select('*').maybeSingle()
    if (error) throw new Error(error.message)
    if (data) return toProfile(data)

    // Accounts created before profiles existed have no row yet: make a default one.
    const user = await currentUser()
    const created = await supabase
      .from('profiles')
      .insert({ first_name: user.email?.split('@')[0] || 'Friend', city: '' })
      .select('*')
      .single()
    if (created.error) throw new Error(created.error.message)
    return toProfile(created.data)
  },

  async updateProfile(update) {
    const user = await currentUser()
    const row: Record<string, string> = {}
    if (update.firstName !== undefined) row.first_name = update.firstName
    if (update.lastName !== undefined) row.last_name = update.lastName
    if (update.city !== undefined) row.city = update.city

    const { data, error } = await getSupabase().from('profiles').update(row).eq('id', user.id).select('*').single()
    if (error) throw new Error(error.message)
    return toProfile(data)
  },
}
