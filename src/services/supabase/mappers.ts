import {
  LIGHTING_TAGS,
  OCCASIONS,
  PRICE_BANDS,
  type Dish,
  type LightingTag,
  type Occasion,
  type PriceBand,
  type Restaurant,
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

export function toRestaurant(row: unknown): Restaurant {
  if (!isRecord(row)) throw new Error('Unexpected data: restaurant row')
  const spend = row.typical_spend_per_person
  if (typeof spend !== 'number') throw new Error('Unexpected data: "typical_spend_per_person" should be a number')

  const restaurant: Restaurant = {
    id: str(row, 'id'),
    name: str(row, 'name'),
    neighborhood: str(row, 'neighborhood'),
    cuisine: str(row, 'cuisine'),
    priceBand: oneOf<PriceBand>(PRICE_BANDS, str(row, 'price_band'), 'price_band'),
    typicalSpendPerPerson: spend,
    photos: strArray(row, 'photos'),
    lighting: oneOf<LightingTag>(LIGHTING_TAGS, str(row, 'lighting'), 'lighting'),
    bestFor: strArray(row, 'best_for').map((o) => oneOf<Occasion>(OCCASIONS, o, 'best_for')),
    vibeTags: strArray(row, 'vibe_tags'),
    whatToOrder: parseDishes(row.what_to_order),
    photosUpdatedAt: str(row, 'photos_updated_at'),
  }
  const sourceUrl = optStr(row, 'source_url')
  if (sourceUrl) restaurant.sourceUrl = sourceUrl
  return restaurant
}

export function toSavedPlace(row: unknown): SavedPlace {
  if (!isRecord(row)) throw new Error('Unexpected data: saved place row')
  return {
    id: str(row, 'id'),
    restaurantId: optStr(row, 'restaurant_id'),
    name: str(row, 'name'),
    sourceUrl: optStr(row, 'source_url'),
    occasions: strArray(row, 'occasions').map((o) => oneOf<Occasion>(OCCASIONS, o, 'occasions')),
    savedAt: str(row, 'saved_at'),
  }
}
