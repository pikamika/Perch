import type { AuthService, AuthUser } from '../authService'
import { AuthError } from '../authService'
import { simulateNetwork } from './delay'

/**
 * Offline stand-in for Supabase Auth: accepts any email and password and remembers the
 * "session" in localStorage. No real accounts are created and nothing is verified.
 */
const STORAGE_KEY = 'cc.mockUser'
const listeners = new Set<(user: AuthUser | null) => void>()

function read(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && 'id' in parsed && 'email' in parsed) {
      const { id, email } = parsed
      if (typeof id === 'string' && typeof email === 'string') return { id, email }
    }
    return null
  } catch {
    return null
  }
}

function write(user: AuthUser | null): void {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    throw new AuthError('Browser storage is unavailable.')
  }
  listeners.forEach((listener) => listener(user))
}

function login(email: string): AuthUser {
  const user: AuthUser = { id: `mock-${email.toLowerCase()}`, email }
  write(user)
  return user
}

export const mockAuthService: AuthService = {
  async getUser() {
    return read()
  },

  onChange(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  async signUp(email) {
    await simulateNetwork(300, 500)
    return { status: 'signed-in', user: login(email) }
  },

  async signIn(email) {
    await simulateNetwork(300, 500)
    return login(email)
  },

  async signOut() {
    await simulateNetwork(100, 200)
    write(null)
  },
}
