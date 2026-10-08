import { useRef, useState, type FormEvent } from 'react'
import { OCCASION_META } from '../../lib/occasions'
import { savedPlaceService } from '../../services'
import { OCCASIONS, type Occasion } from '../../types'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { TextField } from '../ui/TextField'

interface Props {
  onSaved: (name: string) => void
}

interface Errors {
  link?: string
  name?: string
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function AddPlaceForm({ onSaved }: Props) {
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const linkRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  function toggleOccasion(occasion: Occasion) {
    setOccasions((current) =>
      current.includes(occasion) ? current.filter((o) => o !== occasion) : [...current, occasion],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedLink = link.trim()
    const trimmedName = name.trim()

    const nextErrors: Errors = {}
    if (!trimmedLink) nextErrors.link = 'Paste a link to the post or map listing.'
    else if (!isHttpUrl(trimmedLink)) nextErrors.link = 'That doesn’t look like a link. It should start with https://'
    if (!trimmedName) nextErrors.name = 'Add the restaurant’s name.'

    setErrors(nextErrors)
    setSubmitError(null)
    if (nextErrors.link) return linkRef.current?.focus()
    if (nextErrors.name) return nameRef.current?.focus()

    setPending(true)
    try {
      await savedPlaceService.savePlace({ name: trimmedName, sourceUrl: trimmedLink, occasions })
      onSaved(trimmedName)
    } catch {
      setSubmitError('We couldn’t save this place. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <TextField
        ref={linkRef}
        label="Link"
        hint="TikTok, Instagram or Google Maps"
        type="url"
        inputMode="url"
        autoComplete="off"
        placeholder="https://"
        value={link}
        error={errors.link}
        onChange={(e) => setLink(e.target.value)}
      />
      <TextField
        ref={nameRef}
        label="Restaurant name"
        autoComplete="off"
        value={name}
        error={errors.name}
        onChange={(e) => setName(e.target.value)}
      />

      <fieldset>
        <legend className="mb-1 font-semibold">
          Good for <span className="font-normal text-ink-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occasion) => (
            <Chip key={occasion} selected={occasions.includes(occasion)} onClick={() => toggleOccasion(occasion)}>
              {OCCASION_META[occasion].label}
            </Chip>
          ))}
        </div>
      </fieldset>

      {submitError ? (
        <p role="alert" className="font-semibold text-danger">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full md:w-auto">
        {pending ? 'Saving…' : 'Save place'}
      </Button>
    </form>
  )
}
