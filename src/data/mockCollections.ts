/**
 * PLACEHOLDER DATA: editorial sections for the Discover screen (mock mode).
 * Each collection lists restaurant ids from mockRestaurants.ts, in display order.
 * Components never import this file; they go through src/services.
 */
export interface MockCollection {
  id: string
  title: string
  subtitle?: string
  restaurantIds: string[]
}

export const mockCollections: MockCollection[] = [
  {
    id: 'c1',
    title: 'Trending on TikTok',
    subtitle: 'Spots blowing up on your feed',
    restaurantIds: ['r1', 'r5', 'r8', 'r12', 'r3'],
  },
  {
    id: 'c2',
    title: 'Flushing food crawl eats',
    subtitle: 'Eat your way down Main Street',
    restaurantIds: ['r11', 'r13', 'r12', 'r14'],
  },
  {
    id: 'c3',
    title: 'Date night under $40',
    subtitle: 'Low lights, high chemistry',
    restaurantIds: ['r2', 'r7', 'r6'],
  },
  {
    id: 'c4',
    title: 'Photo-ready spots',
    subtitle: 'Great light, even better plates',
    restaurantIds: ['r2', 'r6', 'r8', 'r10', 'r4'],
  },
  {
    id: 'c5',
    title: 'Cheap eats under $20',
    subtitle: 'Big flavor, small bill',
    restaurantIds: ['r3', 'r5', 'r1', 'r13', 'r14', 'r12'],
  },
]
