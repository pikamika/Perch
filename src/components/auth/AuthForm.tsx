import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AuthError } from '../../services'
import { Button, ButtonLink } from '../ui/Button'
import { TextField } from '../ui/TextField'

const MIN_PASSWORD_LENGTH = 8

interface Props {
  mode: 'login' | 'signup'
  /** Where to go after signing in (already checked to be a same-site path). */
  next: string
}

interface Errors {
  email?: string
  password?: string
}

export function AuthForm({ mode, next }: Props) {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const isSignup = mode === 'signup'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const nextQuery = next === '/' ? '' : `?next=${encodeURIComponent(next)}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()

    const nextErrors: Errors = {}
    if (!trimmedEmail) nextErrors.email = 'Enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) nextErrors.email = 'That doesn’t look like an email address.'
    if (!password) nextErrors.password = isSignup ? 'Choose a password.' : 'Enter your password.'
    else if (isSignup && password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    }

    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.email) return emailRef.current?.focus()
    if (nextErrors.password) return passwordRef.current?.focus()

    setPending(true)
    try {
      if (isSignup) {
        const result = await signUp(trimmedEmail, password)
        if (result.status === 'confirmation-required') {
          setConfirmEmail(trimmedEmail)
          return
        }
      } else {
        await signIn(trimmedEmail, password)
      }
      navigate(next, { replace: true })
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  if (confirmEmail) {
    return (
      <div role="status" className="rounded-card bg-surface p-6 text-center shadow-card">
        <p aria-hidden="true" className="text-4xl">
          📬
        </p>
        <h2 className="mt-2 font-display text-title">Check your email</h2>
        <p className="mt-2 text-ink-muted">
          We sent a confirmation link to <strong className="text-ink">{confirmEmail}</strong>. Open it to finish
          creating your account, then log in.
        </p>
        <ButtonLink to={`/login${nextQuery}`} className="mt-5">
          Go to log in
        </ButtonLink>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        ref={emailRef}
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        value={email}
        error={errors.email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <TextField
          ref={passwordRef}
          label="Password"
          hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters` : undefined}
          type={showPassword ? 'text' : 'password'}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="mt-1 flex min-h-touch items-center gap-3 font-medium">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-5 w-5 accent-brand"
          />
          Show password
        </label>
      </div>

      {formError ? (
        <p role="alert" className="font-semibold text-danger">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (isSignup ? 'Creating account…' : 'Logging in…') : isSignup ? 'Create account' : 'Log in'}
      </Button>

      <p className="text-center text-ink-muted">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <Link
          to={`${isSignup ? '/login' : '/signup'}${nextQuery}`}
          className="inline-flex min-h-touch items-center font-semibold text-brand-dark underline"
        >
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </form>
  )
}
