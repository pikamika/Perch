import { isAvatarColor } from '../../lib/avatar'
import type { Profile } from '../../types'

/** Mock-mode profiles live in localStorage, keyed by (mock) user id. */
const STORAGE_KEY = 'cc.mockProfiles.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readAll(): Record<string, Profile> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    if (!isRecord(parsed)) return {}
    const result: Record<string, Profile> = {}
    for (const [id, value] of Object.entries(parsed)) {
      if (
        isRecord(value) &&
        typeof value.firstName === 'string' &&
        typeof value.city === 'string' &&
        typeof value.avatarEmoji === 'string' &&
        typeof value.avatarColor === 'string' &&
        isAvatarColor(value.avatarColor)
      ) {
        result[id] = {
          id,
          firstName: value.firstName,
          city: value.city,
          avatarEmoji: value.avatarEmoji,
          avatarColor: value.avatarColor,
        }
      }
    }
    return result
  } catch {
    return {}
  }
}

export function loadMockProfile(userId: string): Profile | undefined {
  return readAll()[userId]
}

export function saveMockProfile(profile: Profile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [profile.id]: profile }))
  } catch {
    throw new Error('Could not save: browser storage is unavailable')
  }
}
