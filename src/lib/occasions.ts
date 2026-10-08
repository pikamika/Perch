import { OCCASIONS, type Occasion } from '../types'

export const OCCASION_META: Record<Occasion, { label: string; emoji: string }> = {
  date: { label: 'Date night', emoji: '🕯️' },
  birthday: { label: 'Birthday', emoji: '🎂' },
  friends: { label: 'Friends', emoji: '🥂' },
  solo: { label: 'Solo', emoji: '🍜' },
}

export function parseOccasion(value: string | null): Occasion | undefined {
  return OCCASIONS.find((o) => o === value)
}
