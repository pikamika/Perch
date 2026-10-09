import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import type { Profile } from '../../types'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { AvatarEditor } from './AvatarEditor'

/** Edit name, location and profile picture. Email is shown but cannot be changed. */
export function AccountForm({ profile }: { profile: Profile }) {
  const { user } = useAuth()
  const { update } = useProfile()

  const [firstName, setFirstName] = useState(profile.firstName)
  const [city, setCity] = useState(profile.city)
  const [avatar, setAvatar] = useState({ emoji: profile.avatarEmoji, color: profile.avatarColor })
  const [nameTouched, setNameTouched] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const nameEmpty = firstName.trim() === ''
  const dirty =
    firstName.trim() !== profile.firstName ||
    city.trim() !== profile.city ||
    avatar.emoji !== profile.avatarEmoji ||
    avatar.color !== profile.avatarColor

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNameTouched(true)
    if (nameEmpty) return
    setPending(true)
    setMessage(null)
    try {
      const saved = await update({
        firstName: firstName.trim(),
        city: city.trim(),
        avatarEmoji: avatar.emoji,
        avatarColor: avatar.color,
      })
      setFirstName(saved.firstName)
      setCity(saved.city)
      setMessage({ kind: 'ok', text: 'Saved. Your changes are live.' })
    } catch {
      setMessage({ kind: 'error', text: 'We couldn’t save your changes. Please try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section aria-labelledby="picture-heading" className="rounded-card bg-surface p-5 shadow-card">
        <h2 id="picture-heading" className="mb-4 font-display text-title">
          Profile picture
        </h2>
        <AvatarEditor emoji={avatar.emoji} color={avatar.color} onChange={setAvatar} />
      </section>

      <section aria-labelledby="details-heading" className="space-y-5 rounded-card bg-surface p-5 shadow-card">
        <h2 id="details-heading" className="font-display text-title">
          Your details
        </h2>
        <TextField
          label="First name"
          autoComplete="given-name"
          value={firstName}
          error={nameTouched && nameEmpty ? 'Your name can’t be empty.' : undefined}
          onChange={(e) => {
            setFirstName(e.target.value)
            setNameTouched(true)
            setMessage(null)
          }}
        />
        <TextField label="Email" type="email" value={user?.email ?? ''} readOnly hint="Your email can’t be changed." />
        <TextField
          label="Location"
          hint="The city you live in"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            setMessage(null)
          }}
        />
      </section>

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={!dirty || nameEmpty || pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        {message ? (
          <p
            role={message.kind === 'error' ? 'alert' : 'status'}
            className={`text-center font-semibold ${message.kind === 'error' ? 'text-danger' : 'text-success'}`}
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  )
}
