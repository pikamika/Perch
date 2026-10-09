import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AuthError } from '../../services'
import { Button, ButtonLink } from '../ui/Button'
import { PasswordField } from '../ui/PasswordField'
import { TextField } from '../ui/TextField'

const MIN_PASSWORD_LENGTH = 8

interface Props {
  mode: 'login' | 'signup'
  /** Where to go after signing in (already checked to be a same-site path). */
  next: string
}

interface Errors {
  firstName?: string
  city?: string
  email?: string
  password?: string
}

export function AuthForm({ mode, next }: Props) {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const isSignup = mode === 'signup'

  const [firstName, setFirstName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const nextQuery = next === '/' ? '' : `?next=${encodeURIComponent(next)}`

  // The button stays disabled until every field has something in it.
  const allFilled =
    email.trim() !== '' && password !== '' && (!isSignup || (firstName.trim() !== '' && city.trim() !== ''))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedName = firstName.trim()
    const trimmedCity = city.trim()

    const nextErrors: Errors = {}
    if (isSignup && !trimmedName) nextErrors.firstName = 'Enter your first name.'
    if (isSignup && !trimmedCity) nextErrors.city = 'Enter the city you live in.'
    if (!trimmedEmail) nextErrors.email = 'Enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) nextErrors.email = 'That doesn’t look like an email address.'
    if (!password) nextErrors.password = isSignup ? 'Choose a password.' : 'Enter your password.'
    else if (isSignup && password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    }

    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.firstName) return firstNameRef.current?.focus()
    if (nextErrors.city) return cityRef.current?.focus()
    if (nextErrors.email) return emailRef.current?.focus()
    if (nextErrors.password) return passwordRef.current?.focus()

    setPending(true)
    try {
      if (isSignup) {
        const result = await signUp(trimmedEmail, password, { firstName: trimmedName, city: trimmedCity })
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
      {isSignup ? (
        <>
          <TextField
            ref={firstNameRef}
            label="First name"
            autoComplete="given-name"
            value={firstName}
            error={errors.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            ref={cityRef}
            label="City you live in"
            hint="So we can suggest cafes that make sense for you"
            autoComplete="address-level2"
            value={city}
            error={errors.city}
            onChange={(e) => setCity(e.target.value)}
          />
        </>
      ) : null}
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
      <PasswordField
        ref={passwordRef}
        label="Password"
        hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters` : undefined}
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        value={password}
        error={errors.password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {formError ? (
        <p role="alert" className="font-semibold text-danger">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={!allFilled || pending} className="w-full">
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
