import type { Session, User } from '@supabase/supabase-js'
import { getSupabase } from '../../lib/supabaseClient'
import { AuthError, type AuthService, type AuthUser } from '../authService'

function toAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user?.email) return null
  return { id: user.id, email: user.email }
}

function fromSession(session: Session | null): AuthUser | null {
  return toAuthUser(session?.user)
}

/** Turns Supabase error codes into messages a person can act on. */
function friendly(error: { code?: string; message: string; status?: number }): AuthError {
  switch (error.code) {
    case 'invalid_credentials':
      return new AuthError('That email and password don’t match. Please try again.')
    case 'email_not_confirmed':
      return new AuthError('Please confirm your email first. Check your inbox for the link we sent.')
    case 'user_already_exists':
    case 'email_exists':
      return new AuthError('An account with this email already exists. Try logging in instead.')
    case 'weak_password':
      return new AuthError('That password is too weak. Use at least 8 characters.')
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return new AuthError('Too many attempts. Please wait a few minutes and try again.')
    case 'email_address_invalid':
      return new AuthError('That email address doesn’t look valid.')
    default:
      return new AuthError('Something went wrong. Please try again.')
  }
}

export const supabaseAuthService: AuthService = {
  async getUser() {
    const { data, error } = await getSupabase().auth.getSession()
    if (error) return null
    return fromSession(data.session)
  },

  onChange(listener) {
    const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
      listener(fromSession(session))
    })
    return () => data.subscription.unsubscribe()
  },

  async signUp(email, password) {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      // Where the confirmation link sends people back to (must be allowed in Supabase URL settings).
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    if (error) throw friendly(error)

    // With email confirmation on, an already-registered email comes back as a user with no identities.
    if (data.user && data.user.identities?.length === 0) {
      throw new AuthError('An account with this email already exists. Try logging in instead.')
    }
    const user = fromSession(data.session)
    return user ? { status: 'signed-in', user } : { status: 'confirmation-required' }
  },

  async signIn(email, password) {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw friendly(error)
    const user = toAuthUser(data.user)
    if (!user) throw new AuthError('Something went wrong. Please try again.')
    return user
  },

  async signOut() {
    const { error } = await getSupabase().auth.signOut()
    if (error) throw new AuthError('We couldn’t log you out. Please try again.')
  },
}
