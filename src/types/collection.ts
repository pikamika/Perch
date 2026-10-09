import type { Cafe } from './cafe'

/** An editorial section on Discover, e.g. "Trending on TikTok". */
export interface Collection {
  id: string
  title: string
  subtitle?: string
  cafes: Cafe[]
}
