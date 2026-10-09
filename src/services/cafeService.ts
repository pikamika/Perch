import type { Cafe, CafeFilters } from '../types'

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export interface CafeService {
  /** Returns cafes matching the filters, best matches first. */
  listCafes(filters?: CafeFilters): Promise<Cafe[]>
  /** Rejects with NotFoundError when the id does not exist. */
  getCafe(id: string): Promise<Cafe>
}
