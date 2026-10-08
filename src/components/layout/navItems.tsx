import type { ReactNode } from 'react'
import { BookmarkIcon, HomeIcon, PlusIcon } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: <HomeIcon />, end: true },
  { to: '/saved', label: 'Saved', icon: <BookmarkIcon />, end: false },
  { to: '/add', label: 'Add', icon: <PlusIcon />, end: false },
]
