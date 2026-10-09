import { filterCafes, rankCafes } from '../../lib/filterCafes'
import { mockCafes } from '../../data/mockCafes'
import { NotFoundError, type CafeService } from '../cafeService'
import { simulateNetwork } from './delay'

export const mockCafeService: CafeService = {
  async listCafes(filters = {}) {
    await simulateNetwork()
    return rankCafes(filterCafes(mockCafes, filters), filters.purpose)
  },

  async getCafe(id) {
    await simulateNetwork()
    const found = mockCafes.find((c) => c.id === id)
    if (!found) throw new NotFoundError(`No cafe with id "${id}"`)
    return found
  },
}
