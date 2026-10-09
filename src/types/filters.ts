import type { Need, Purpose } from './cafe'

export interface CafeFilters {
  purpose?: Purpose
  /** Maximum typical spend (drink plus snack) in USD. */
  maxSpend?: number
  /** Must-haves: every one listed has to be true for a cafe to match. */
  needs?: Need[]
}
