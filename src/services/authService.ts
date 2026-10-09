export interface AuthUser {
  id: string
  email: string
}

/** What happened after creating an account. */
export type SignUpResult =
  | { status: 'signed-in'; user: AuthUser }
  /** The project requires email confirmation: the person must click the link we emailed. */
  | { status: 'confirmation-required' }

/** An error with a message that is safe and friendly to show to the person. */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export interface AuthService {
  /** The currently signed-in user, or null. */
  getUser(): Promise<AuthUser | null>
  /** Calls the listener whenever someone signs in or out. Returns an unsubscribe function. */
  onChange(listener: (user: AuthUser | null) => void): () => void
  signUp(email: string, password: string): Promise<SignUpResult>
  signIn(email: string, password: string): Promise<AuthUser>
  signOut(): Promise<void>
}
