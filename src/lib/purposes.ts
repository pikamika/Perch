import { PURPOSES, type Purpose } from '../types'

export const PURPOSE_META: Record<Purpose, { label: string; emoji: string; hint: string }> = {
  focus: { label: 'Focus time', emoji: '💻', hint: 'Heads-down work for a few hours' },
  calls: { label: 'Calls', emoji: '🎧', hint: 'Quiet enough to take a meeting' },
  sprint: { label: 'Quick sprint', emoji: '⚡', hint: 'An hour or two, in and out' },
  walk: { label: 'Coffee walk', emoji: '🍵', hint: 'Grab something and go' },
}

export function parsePurpose(value: string | null): Purpose | undefined {
  return PURPOSES.find((p) => p === value)
}
