import { useContext } from 'react'
import { ProfileContext, type ProfileContextValue } from '../components/profile/profileContext'

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext)
  if (!value) throw new Error('useProfile must be used inside <ProfileProvider>')
  return value
}
