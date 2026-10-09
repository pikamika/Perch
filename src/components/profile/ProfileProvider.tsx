import { useCallback, useMemo, type ReactNode } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { profileService } from '../../services'
import type { Profile, ProfileUpdate } from '../../types'
import { ProfileContext, type ProfileContextValue } from './profileContext'

/** Loads the signed-in user's profile once and shares it with every screen. */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const { state, reload, setData } = useAsync<Profile | null>(`profile:${userId ?? 'none'}`, () =>
    userId ? profileService.getProfile() : Promise.resolve(null),
  )

  const update = useCallback(
    async (change: ProfileUpdate): Promise<Profile> => {
      const next = await profileService.updateProfile(change)
      setData(() => next)
      return next
    },
    [setData],
  )

  const value = useMemo<ProfileContextValue>(() => {
    if (!userId) return { status: 'none', profile: null, update, reload }
    if (state.status === 'loading') return { status: 'loading', profile: null, update, reload }
    if (state.status === 'error') return { status: 'error', profile: null, update, reload }
    return { status: state.data ? 'ready' : 'none', profile: state.data, update, reload }
  }, [userId, state, update, reload])

  return <ProfileContext value={value}>{children}</ProfileContext>
}
