import {
  LIGHTING_TAGS,
  NOISE_LEVELS,
  OUTLET_LEVELS,
  PURPOSES,
  PRICE_BANDS,
  SEATING_LEVELS,
  WIFI_ACCESS,
  WIFI_SPEEDS,
  type Dish,
  type LightingTag,
  type NoiseLevel,
  type OutletLevel,
  type Purpose,
  type PriceBand,
  type SeatingLevel,
  type WifiAccess,
  type WifiSpeed,
  type Collection,
  type Profile,
  type Cafe,
  type SavedPlace,
} from '../../types'

// Database rows use snake_case. These mappers turn them into the app's domain types
// and fail loudly if the database returns something unexpected.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function str(row: Record<string, unknown>, key: string): string {
  const value = row[key]
  if (typeof value !== 'string') throw new Error(`Unexpected data: "${key}" should be text`)
  return value
}

function optStr(row: Record<string, unknown>, key: string): string | undefined {
  const value = row[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function oneOf<T extends string>(allowed: readonly T[], value: string, key: string): T {
  const found = allowed.find((a) => a === value)
  if (found === undefined) throw new Error(`Unexpected data: "${key}" has invalid value "${value}"`)
  return found
}

function bool(row: Record<string, unknown>, key: string): boolean {
  const value = row[key]
  if (typeof value !== 'boolean') throw new Error(`Unexpected data: "${key}" should be true or false`)
  return value
}

function strArray(row: Record<string, unknown>, key: string): string[] {
  const value = row[key]
  if (!Array.isArray(value) || !value.every((v): v is string => typeof v === 'string')) {
    throw new Error(`Unexpected data: "${key}" should be a list of text`)
  }
  return value
}

function parseDishes(value: unknown): Dish[] {
  if (!Array.isArray(value)) throw new Error('Unexpected data: "what_to_order" should be a list')
  return value.map((item): Dish => {
    if (!isRecord(item) || typeof item.name !== 'string') {
      throw new Error('Unexpected data: a dish is missing its name')
    }
    return typeof item.note === 'string' && item.note.length > 0
      ? { name: item.name, note: item.note }
      : { name: item.name }
  })
}

export function toCafe(row: unknown): Cafe {
  if (!isRecord(row)) throw new Error('Unexpected data: cafe row')
  const spend = row.typical_spend_per_person
  if (typeof spend !== 'number') throw new Error('Unexpected data: "typical_spend_per_person" should be a number')

  const cafe: Cafe = {
    id: str(row, 'id'),
    name: str(row, 'name'),
    neighborhood: str(row, 'neighborhood'),
    specialty: str(row, 'specialty'),
    priceBand: oneOf<PriceBand>(PRICE_BANDS, str(row, 'price_band'), 'price_band'),
    typicalSpendPerPerson: spend,
    photos: strArray(row, 'photos'),
    lighting: oneOf<LightingTag>(LIGHTING_TAGS, str(row, 'lighting'), 'lighting'),
    bestFor: strArray(row, 'best_for').map((o) => oneOf<Purpose>(PURPOSES, o, 'best_for')),
    vibeTags: strArray(row, 'vibe_tags'),
    whatToOrder: parseDishes(row.what_to_order),
    photosUpdatedAt: str(row, 'photos_updated_at'),
    wifi: oneOf<WifiAccess>(WIFI_ACCESS, str(row, 'wifi'), 'wifi'),
    wifiSecured: bool(row, 'wifi_secured'),
    outlets: oneOf<OutletLevel>(OUTLET_LEVELS, str(row, 'outlets'), 'outlets'),
    seating: oneOf<SeatingLevel>(SEATING_LEVELS, str(row, 'seating'), 'seating'),
    noise: oneOf<NoiseLevel>(NOISE_LEVELS, str(row, 'noise'), 'noise'),
    laptopFriendly: bool(row, 'laptop_friendly'),
    bestTimeToWork: str(row, 'best_time_to_work'),
    busiestTimes: str(row, 'busiest_times'),
    workInfoUpdatedAt: str(row, 'work_info_updated_at'),
  }
  const wifiSpeed = optStr(row, 'wifi_speed')
  if (wifiSpeed) cafe.wifiSpeed = oneOf<WifiSpeed>(WIFI_SPEEDS, wifiSpeed, 'wifi_speed')
  const chainName = optStr(row, 'chain_name')
  if (chainName) cafe.chainName = chainName
  const sourceUrl = optStr(row, 'source_url')
  if (sourceUrl) cafe.sourceUrl = sourceUrl
  return cafe
}

export function toSavedPlace(row: unknown): SavedPlace {
  if (!isRecord(row)) throw new Error('Unexpected data: saved place row')
  return {
    id: str(row, 'id'),
    cafeId: optStr(row, 'cafe_id'),
    name: str(row, 'name'),
    sourceUrl: optStr(row, 'source_url'),
    purposes: strArray(row, 'purposes').map((o) => oneOf<Purpose>(PURPOSES, o, 'purposes')),
    savedAt: str(row, 'saved_at'),
  }
}

export function toProfile(row: unknown): Profile {
  if (!isRecord(row)) throw new Error('Unexpected data: profile row')
  return {
    id: str(row, 'id'),
    firstName: str(row, 'first_name'),
    city: typeof row.city === 'string' ? row.city : '',
  }
}

export function toCollection(row: unknown): Collection {
  if (!isRecord(row)) throw new Error('Unexpected data: collection row')
  const items = Array.isArray(row.collection_cafes) ? row.collection_cafes : []
  const cafes = items
    .filter(isRecord)
    .map((item) => ({
      position: typeof item.position === 'number' ? item.position : 0,
      // The embedded cafe arrives as an object (or a one-item list, depending on the API version).
      cafe: Array.isArray(item.cafe) ? item.cafe[0] : item.cafe,
    }))
    .filter((item) => item.cafe !== undefined && item.cafe !== null)
    .sort((a, b) => a.position - b.position)
    .map((item) => toCafe(item.cafe))
  return { id: str(row, 'id'), title: str(row, 'title'), subtitle: optStr(row, 'subtitle'), cafes }
}
