import type { Collection } from '../types'

export interface CollectionService {
  /** The editorial sections shown on Discover, in display order. */
  listCollections(): Promise<Collection[]>
}
