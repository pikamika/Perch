import type { ReactNode } from 'react'
import { BookmarkIcon, CompassIcon, PlusIcon, UserIcon } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Discover', icon: <CompassIcon />, end: true },
  { to: '/saved', label: 'Saved', icon: <BookmarkIcon />, end: false },
  { to: '/add', label: 'Add', icon: <PlusIcon />, end: false },
  { to: '/account', label: 'Account', icon: <UserIcon />, end: false },
]
