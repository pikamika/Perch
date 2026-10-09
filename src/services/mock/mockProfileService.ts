import type { Profile } from '../../types'
import type { ProfileService } from '../profileService'
import { readMockUser } from './mockAuthService'
import { simulateNetwork } from './delay'
import { loadMockProfile, saveMockProfile } from './mockProfileStore'

function requireUser() {
  const user = readMockUser()
  if (!user) throw new Error('Not signed in')
  return user
}

export const mockProfileService: ProfileService = {
  async getProfile() {
    await simulateNetwork(150, 300)
    const user = requireUser()
    const existing = loadMockProfile(user.id)
    if (existing) return existing
    const created: Profile = {
      id: user.id,
      firstName: user.email.split('@')[0] || 'Friend',
      city: '',
    }
    saveMockProfile(created)
    return created
  },

  async updateProfile(update) {
    await simulateNetwork(200, 400)
    const user = requireUser()
    const current = loadMockProfile(user.id)
    if (!current) throw new Error('Profile not found')
    const next: Profile = { ...current, ...update }
    saveMockProfile(next)
    return next
  },
}
