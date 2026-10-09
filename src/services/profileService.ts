import type { Profile, ProfileUpdate } from '../types'

export interface ProfileService {
  /** The signed-in user's profile. Creates a default one if none exists yet. */
  getProfile(): Promise<Profile>
  updateProfile(update: ProfileUpdate): Promise<Profile>
}
