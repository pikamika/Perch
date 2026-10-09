import { cafeService } from '../services'
import type { CafeFilters } from '../types'
import { useAsync } from './useAsync'

export function useCafes(filters: CafeFilters = {}) {
  const key = JSON.stringify(filters)
  return useAsync(`cafes:${key}`, () => cafeService.listCafes(filters))
}
