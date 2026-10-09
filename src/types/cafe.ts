/** What someone is at the cafe to do. */
export const PURPOSES = ['focus', 'calls', 'sprint', 'walk'] as const
export type Purpose = (typeof PURPOSES)[number]

export const PRICE_BANDS = ['$', '$$', '$$$'] as const
export type PriceBand = (typeof PRICE_BANDS)[number]

export const LIGHTING_TAGS = ['natural', 'warm', 'dim', 'neon'] as const
export type LightingTag = (typeof LIGHTING_TAGS)[number]

/** Can you get online, and what does it cost you? */
export const WIFI_ACCESS = ['free', 'free-with-purchase', 'paid', 'none'] as const
export type WifiAccess = (typeof WIFI_ACCESS)[number]

export const WIFI_SPEEDS = ['fast', 'ok', 'slow'] as const
export type WifiSpeed = (typeof WIFI_SPEEDS)[number]

export const OUTLET_LEVELS = ['plenty', 'some', 'few', 'none'] as const
export type OutletLevel = (typeof OUTLET_LEVELS)[number]

export const SEATING_LEVELS = ['plenty', 'some', 'limited'] as const
export type SeatingLevel = (typeof SEATING_LEVELS)[number]

export const NOISE_LEVELS = ['quiet', 'moderate', 'loud'] as const
export type NoiseLevel = (typeof NOISE_LEVELS)[number]

/** Must-haves a remote worker can switch on while browsing. */
export const NEEDS = ['wifi', 'outlets', 'seats', 'quiet'] as const
export type Need = (typeof NEEDS)[number]

export interface Dish {
  name: string
  note?: string
}

export interface Cafe {
  id: string
  name: string
  neighborhood: string
  /** e.g. "Matcha bar" or "Specialty coffee". */
  specialty: string
  /** Set for chain locations (e.g. a "solid backup" that always has Wi-Fi). */
  chainName?: string
  priceBand: PriceBand
  /** What a typical drink plus a snack costs, in USD. */
  typicalSpendPerPerson: number
  /** 3 to 5 image URLs. */
  photos: string[]
  lighting: LightingTag
  bestFor: Purpose[]
  vibeTags: string[]
  /** 2 to 3 drinks or bites. */
  whatToOrder: Dish[]
  /** ISO date (YYYY-MM-DD) of the newest photos. */
  photosUpdatedAt: string
  /** TikTok / IG / Google Maps link this place was found through. */
  sourceUrl?: string

  // Work details: the reason this app exists.
  wifi: WifiAccess
  /** Only meaningful when there is Wi-Fi. */
  wifiSpeed?: WifiSpeed
  /** A password-protected network rather than an open one. */
  wifiSecured: boolean
  outlets: OutletLevel
  seating: SeatingLevel
  noise: NoiseLevel
  laptopFriendly: boolean
  /** e.g. "Weekdays before 11am". */
  bestTimeToWork: string
  /** e.g. "Weekends 11am to 3pm". */
  busiestTimes: string
  /** ISO date (YYYY-MM-DD) the work details were last checked; Wi-Fi and seating change. */
  workInfoUpdatedAt: string
}
