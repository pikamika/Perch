import type { Cafe, CafeFilters } from '../types'
import { meetsNeed, workScore } from './work'

/** Applies Discover's purpose, budget and must-have filters to a list that is already loaded. */
export function filterCafes(cafes: Cafe[], filters: CafeFilters): Cafe[] {
  return cafes.filter(
    (c) =>
      (!filters.purpose || c.bestFor.includes(filters.purpose)) &&
      (filters.maxSpend === undefined || c.typicalSpendPerPerson <= filters.maxSpend) &&
      (filters.needs ?? []).every((need) => meetsNeed(c, need)),
  )
}

/** Best for working first; ties go to the most recently checked details. */
export function rankCafes(cafes: Cafe[], purpose?: string): Cafe[] {
  return [...cafes].sort(
    (a, b) =>
      workScore(b, purpose) - workScore(a, purpose) || b.workInfoUpdatedAt.localeCompare(a.workInfoUpdatedAt),
  )
}
