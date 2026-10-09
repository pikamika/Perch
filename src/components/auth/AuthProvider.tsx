import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, type AuthUser } from '../../services'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = still checking; null = signed out
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    const unsubscribe = authService.onChange((next) => {
      if (active) setUser(next)
    })
    authService.getUser().then(
      (current) => {
        if (active) setUser((previous) => (previous === undefined ? current : previous))
      },
      () => {
        if (active) setUser((previous) => (previous === undefined ? null : previous))
      },
    )
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: user === undefined ? 'loading' : user ? 'signed-in' : 'signed-out',
      user: user ?? null,
      signUp: (email, password) => authService.signUp(email, password),
      signIn: async (email, password) => {
        await authService.signIn(email, password)
      },
      signOut: () => authService.signOut(),
    }),
    [user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
