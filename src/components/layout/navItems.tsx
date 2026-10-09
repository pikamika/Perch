import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { BookmarkIcon, HomeIcon, PlusIcon, UserIcon } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

/** Main destinations. The last tab is "Account" when signed in and "Log in" otherwise. */
export function useNavItems(): NavItem[] {
  const { status } = useAuth()
  const signedOut = status === 'signed-out'
  return [
    { to: '/', label: 'Home', icon: <HomeIcon />, end: true },
    { to: '/saved', label: 'Saved', icon: <BookmarkIcon />, end: false },
    { to: '/add', label: 'Add', icon: <PlusIcon />, end: false },
    {
      to: signedOut ? '/login' : '/account',
      label: signedOut ? 'Log in' : 'Account',
      icon: <UserIcon />,
      end: false,
    },
  ]
}
