import { PURPOSES, type Purpose, type SavedPlace } from '../../types'
import type { SavedPlaceService } from '../savedPlaceService'
import { simulateNetwork } from './delay'

const STORAGE_KEY = 'cc.savedPlaces.v1'

function isPurpose(value: unknown): value is Purpose {
  return typeof value === 'string' && (PURPOSES as readonly string[]).includes(value)
}

function isSavedPlace(value: unknown): value is SavedPlace {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.savedAt === 'string' &&
    Array.isArray(v.purposes) &&
    v.purposes.every(isPurpose)
  )
}

function readAll(): SavedPlace[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isSavedPlace) : []
  } catch {
    return []
  }
}

function writeAll(places: SavedPlace[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
  } catch {
    throw new Error('Could not save: browser storage is unavailable')
  }
}

export const mockSavedPlaceService: SavedPlaceService = {
  async listSavedPlaces() {
    await simulateNetwork(200, 400)
    return readAll().sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  },

  async savePlace(input) {
    await simulateNetwork(200, 400)
    const all = readAll()
    if (input.cafeId) {
      const existing = all.find((p) => p.cafeId === input.cafeId)
      if (existing) return existing
    }
    const place: SavedPlace = {
      id: crypto.randomUUID(),
      cafeId: input.cafeId,
      name: input.name,
      sourceUrl: input.sourceUrl,
      purposes: input.purposes ?? [],
      savedAt: new Date().toISOString(),
    }
    writeAll([place, ...all])
    return place
  },

  async removeSavedPlace(id) {
    await simulateNetwork(200, 400)
    writeAll(readAll().filter((p) => p.id !== id))
  },
}
