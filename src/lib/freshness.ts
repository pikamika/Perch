export interface Freshness {
  label: string
  /** True when the photos are recent enough to trust (3 months or less). */
  isFresh: boolean
}

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44

export function getFreshness(photosUpdatedAt: string, now: Date = new Date()): Freshness {
  const updated = new Date(photosUpdatedAt)
  const months = (now.getTime() - updated.getTime()) / MS_PER_MONTH

  if (months <= 3) return { label: 'Photos from the last 3 months', isFresh: true }
  if (months <= 6) return { label: 'Photos from the last 6 months', isFresh: false }
  if (months <= 12) return { label: 'Photos from the last year', isFresh: false }
  return { label: 'Photos over a year old', isFresh: false }
}

export function formatPhotoDate(photosUpdatedAt: string): string {
  return new Date(photosUpdatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** How trustworthy the Wi-Fi / seating details are: these change more often than photos do. */
export function getWorkInfoFreshness(workInfoUpdatedAt: string, now: Date = new Date()): Freshness {
  const months = Math.floor((now.getTime() - new Date(workInfoUpdatedAt).getTime()) / MS_PER_MONTH)
  if (months < 1) return { label: 'Work details checked this month', isFresh: true }
  if (months <= 3) return { label: `Work details checked ${months} month${months === 1 ? '' : 's'} ago`, isFresh: true }
  return {
    label: `Work details checked ${months} months ago. Wi-Fi and seating may have changed.`,
    isFresh: false,
  }
}
