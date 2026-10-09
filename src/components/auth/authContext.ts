import { createContext } from 'react'
import type { AuthUser, SignUpResult } from '../../services'

export interface AuthContextValue {
  /** 'loading' until we know whether someone is signed in. */
  status: 'loading' | 'signed-in' | 'signed-out'
  user: AuthUser | null
  signUp: (email: string, password: string) => Promise<SignUpResult>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
