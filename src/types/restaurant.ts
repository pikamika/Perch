export const OCCASIONS = ['date', 'birthday', 'friends', 'solo'] as const
export type Occasion = (typeof OCCASIONS)[number]

export const PRICE_BANDS = ['$', '$$', '$$$'] as const
export type PriceBand = (typeof PRICE_BANDS)[number]

export const LIGHTING_TAGS = ['natural', 'warm', 'dim', 'neon'] as const
export type LightingTag = (typeof LIGHTING_TAGS)[number]

export interface Dish {
  name: string
  note?: string
}

export interface Restaurant {
  id: string
  name: string
  neighborhood: string
  cuisine: string
  priceBand: PriceBand
  /** Typical spend per person in USD. */
  typicalSpendPerPerson: number
  /** 3 to 5 image URLs. */
  photos: string[]
  lighting: LightingTag
  bestFor: Occasion[]
  vibeTags: string[]
  /** 2 to 3 dishes. */
  whatToOrder: Dish[]
  /** ISO date (YYYY-MM-DD) of the newest photos; powers the freshness signal. */
  photosUpdatedAt: string
  /** TikTok / IG / Google Maps link this place was saved from. */
  sourceUrl?: string
}
