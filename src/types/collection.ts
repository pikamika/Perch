import type { Restaurant } from './restaurant'

/** An editorial section on Discover, e.g. "Trending on TikTok". */
export interface Collection {
  id: string
  title: string
  subtitle?: string
  restaurants: Restaurant[]
}
