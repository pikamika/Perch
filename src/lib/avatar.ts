import { AVATAR_COLORS, type AvatarColor } from '../types'

/** Dominant color of an emoji, used to pick a background that makes it stand out. */
type Hue = Exclude<AvatarColor, 'black'> | 'neutral'

export const FOOD_EMOJIS: ReadonlyArray<{ emoji: string; hue: Hue }> = [
  { emoji: '🍎', hue: 'red' },
  { emoji: '🍓', hue: 'red' },
  { emoji: '🍅', hue: 'red' },
  { emoji: '🌶️', hue: 'red' },
  { emoji: '🍣', hue: 'orange' },
  { emoji: '🍊', hue: 'orange' },
  { emoji: '🥕', hue: 'orange' },
  { emoji: '🍋', hue: 'yellow' },
  { emoji: '🍌', hue: 'yellow' },
  { emoji: '🧀', hue: 'yellow' },
  { emoji: '🥑', hue: 'green' },
  { emoji: '🥦', hue: 'green' },
  { emoji: '🥝', hue: 'green' },
  { emoji: '🫐', hue: 'blue' },
  { emoji: '🍇', hue: 'purple' },
  { emoji: '🍆', hue: 'purple' },
  { emoji: '🍔', hue: 'neutral' },
  { emoji: '🌮', hue: 'neutral' },
  { emoji: '🍕', hue: 'neutral' },
  { emoji: '🍜', hue: 'neutral' },
  { emoji: '🥟', hue: 'neutral' },
  { emoji: '🍩', hue: 'neutral' },
  { emoji: '🍪', hue: 'neutral' },
  { emoji: '🥐', hue: 'neutral' },
]

/** Backgrounds with strong contrast against each emoji hue (never the same or a neighboring color). */
const GOOD_BACKGROUNDS: Record<Hue, readonly AvatarColor[]> = {
  red: ['blue', 'purple', 'black'],
  orange: ['blue', 'purple', 'black'],
  yellow: ['blue', 'purple', 'black'],
  green: ['purple', 'black'],
  blue: ['yellow', 'orange'],
  purple: ['yellow', 'orange'],
  neutral: ['blue', 'purple', 'green', 'black'],
}

export const AVATAR_COLOR_META: Record<AvatarColor, { label: string; bgClass: string }> = {
  red: { label: 'Red', bgClass: 'bg-avatar-red' },
  orange: { label: 'Orange', bgClass: 'bg-avatar-orange' },
  yellow: { label: 'Yellow', bgClass: 'bg-avatar-yellow' },
  green: { label: 'Green', bgClass: 'bg-avatar-green' },
  blue: { label: 'Blue', bgClass: 'bg-avatar-blue' },
  purple: { label: 'Purple', bgClass: 'bg-avatar-purple' },
  black: { label: 'Black', bgClass: 'bg-avatar-black' },
}

export function isAvatarColor(value: string): value is AvatarColor {
  return AVATAR_COLORS.some((c) => c === value)
}

function pickOne<T>(items: readonly T[]): T {
  const item = items[Math.floor(Math.random() * items.length)]
  if (item === undefined) throw new Error('Cannot pick from an empty list')
  return item
}

/** A random food emoji on a background that contrasts with it. */
export function randomAvatar(): { avatarEmoji: string; avatarColor: AvatarColor } {
  const { emoji, hue } = pickOne(FOOD_EMOJIS)
  return { avatarEmoji: emoji, avatarColor: pickOne(GOOD_BACKGROUNDS[hue]) }
}

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const EMOJI_PATTERN = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u

/**
 * Finds the last emoji in whatever was typed or pasted, so typing a new emoji
 * replaces the old one. Returns undefined when the text contains no emoji.
 */
export function lastEmoji(text: string): string | undefined {
  let found: string | undefined
  for (const { segment } of segmenter.segment(text)) {
    if (EMOJI_PATTERN.test(segment)) found = segment
  }
  return found
}
