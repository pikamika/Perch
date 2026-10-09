import { createContext } from 'react'
import type { Profile, ProfileUpdate } from '../../types'

export interface ProfileContextValue {
  status: 'loading' | 'ready' | 'error' | 'none'
  /** null until loaded, and when signed out. */
  profile: Profile | null
  update: (update: ProfileUpdate) => Promise<Profile>
  reload: () => void
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)
