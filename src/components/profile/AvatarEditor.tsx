import { useId, useState } from 'react'
import { AVATAR_COLOR_META, FOOD_EMOJIS, lastEmoji } from '../../lib/avatar'
import { AVATAR_COLORS, type AvatarColor } from '../../types'
import { Avatar } from './Avatar'

interface Props {
  emoji: string
  color: AvatarColor
  onChange: (next: { emoji: string; color: AvatarColor }) => void
}

export function AvatarEditor({ emoji, color, onChange }: Props) {
  const groupName = useId()
  const [customText, setCustomText] = useState('')

  function handleCustom(text: string) {
    const picked = lastEmoji(text)
    if (picked) onChange({ emoji: picked, color })
    // The field only exists to open the keyboard (and catch pasted emoji), so it always stays empty.
    setCustomText('')
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <Avatar emoji={emoji} color={color} size="lg" label="Your profile picture" />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Emoji</legend>
        <div className="grid grid-cols-6 gap-2">
          {FOOD_EMOJIS.map((item) => (
            <button
              key={item.emoji}
              type="button"
              aria-pressed={item.emoji === emoji}
              aria-label={`Use ${item.emoji}`}
              onClick={() => onChange({ emoji: item.emoji, color })}
              className={`flex h-touch items-center justify-center rounded-chip border-2 text-2xl ${
                item.emoji === emoji ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:bg-sand'
              }`}
            >
              <span aria-hidden="true">{item.emoji}</span>
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-caption font-semibold text-ink-muted">Or type any emoji</span>
          <input
            type="text"
            value={customText}
            onChange={(e) => handleCustom(e.target.value)}
            placeholder="😀"
            autoComplete="off"
            className="min-h-touch w-full rounded-chip border-2 border-line bg-surface px-4 text-body placeholder:text-ink-muted"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">Background color</legend>
        <div className="flex flex-wrap gap-2">
          {AVATAR_COLORS.map((c) => (
            <label key={c} className="relative cursor-pointer">
              <input
                type="radio"
                name={groupName}
                value={c}
                checked={c === color}
                onChange={() => onChange({ emoji, color: c })}
                className="peer sr-only"
              />
              <span
                className={`flex h-touch w-touch items-center justify-center rounded-full border-2 border-transparent text-white peer-checked:border-ink peer-checked:ring-2 peer-checked:ring-surface peer-focus-visible:ring-4 peer-focus-visible:ring-focus ${AVATAR_COLOR_META[c].bgClass}`}
              >
                {c === color ? <span aria-hidden="true" className={c === 'yellow' ? 'text-ink' : ''}>✓</span> : null}
                <span className="sr-only">{AVATAR_COLOR_META[c].label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
