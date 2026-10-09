import type { Cafe, Need, NoiseLevel, OutletLevel, SeatingLevel, WifiAccess, WifiSpeed } from '../types'
import { NEEDS } from '../types'

export const NEED_META: Record<Need, { label: string; emoji: string }> = {
  wifi: { label: 'Free Wi-Fi', emoji: '📶' },
  outlets: { label: 'Outlets', emoji: '🔌' },
  seats: { label: 'Easy seating', emoji: '💺' },
  quiet: { label: 'Quiet', emoji: '🤫' },
}

export function parseNeeds(value: string | null): Need[] {
  if (!value) return []
  const wanted = value.split(',')
  return NEEDS.filter((n) => wanted.includes(n))
}

export const WIFI_LABEL: Record<WifiAccess, string> = {
  free: 'Free Wi-Fi',
  'free-with-purchase': 'Wi-Fi with a purchase',
  paid: 'Paid Wi-Fi',
  none: 'No Wi-Fi',
}

export const WIFI_SPEED_LABEL: Record<WifiSpeed, string> = {
  fast: 'Fast',
  ok: 'Okay',
  slow: 'Slow',
}

export const OUTLET_LABEL: Record<OutletLevel, string> = {
  plenty: 'Plenty of outlets',
  some: 'Some outlets',
  few: 'A few outlets',
  none: 'No outlets',
}

export const SEATING_LABEL: Record<SeatingLevel, string> = {
  plenty: 'Plenty of seats',
  some: 'Some seats',
  limited: 'Limited seating',
}

export const NOISE_LABEL: Record<NoiseLevel, string> = {
  quiet: 'Quiet',
  moderate: 'Some buzz',
  loud: 'Loud',
}

/** Does this cafe satisfy a must-have? */
export function meetsNeed(cafe: Cafe, need: Need): boolean {
  switch (need) {
    case 'wifi':
      return cafe.wifi === 'free'
    case 'outlets':
      return cafe.outlets === 'plenty' || cafe.outlets === 'some'
    case 'seats':
      return cafe.seating === 'plenty'
    case 'quiet':
      return cafe.noise === 'quiet'
  }
}

/** Rough "how good is this to work from" score used to rank picks. Higher is better. */
export function workScore(cafe: Cafe, purpose?: string): number {
  if (purpose === 'walk') {
    // Grab-and-go: the work details barely matter, so just prefer places built for it.
    return cafe.bestFor.includes('walk') ? 10 : 0
  }
  let score = 0
  score += { free: 4, 'free-with-purchase': 2, paid: 1, none: 0 }[cafe.wifi]
  if (cafe.wifiSpeed) score += { fast: 2, ok: 1, slow: 0 }[cafe.wifiSpeed]
  score += { plenty: 3, some: 2, few: 1, none: 0 }[cafe.outlets]
  score += { plenty: 3, some: 1, limited: 0 }[cafe.seating]
  score += { quiet: purpose === 'calls' ? 4 : 2, moderate: 1, loud: 0 }[cafe.noise]
  if (!cafe.laptopFriendly) score -= 5
  return score
}

export const WIFI_SHORT: Record<WifiAccess, string> = {
  free: 'Free',
  'free-with-purchase': 'With purchase',
  paid: 'Paid',
  none: 'None',
}

export const OUTLET_SHORT: Record<OutletLevel, string> = {
  plenty: 'Plenty',
  some: 'Some',
  few: 'Few',
  none: 'None',
}

export const SEATING_SHORT: Record<SeatingLevel, string> = {
  plenty: 'Plenty',
  some: 'Some',
  limited: 'Limited',
}

export interface WorkVerdict {
  tone: 'great' | 'okay' | 'quick'
  label: string
  emoji: string
}

/** One-glance answer to "can I work here?", based on the same score used for ranking. */
export function workVerdict(cafe: Cafe): WorkVerdict {
  const score = workScore(cafe)
  if (score >= 11) return { tone: 'great', label: 'Great for working', emoji: '✅' }
  if (score >= 6) return { tone: 'okay', label: 'Works in a pinch', emoji: '🟡' }
  return { tone: 'quick', label: 'Better for a quick stop', emoji: '☕' }
}
