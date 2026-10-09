/**
 * PLACEHOLDER DATA: editorial sections for the Discover screen (mock mode).
 * Each collection lists cafe ids from mockCafes.ts, in display order.
 * Components never import this file; they go through src/services.
 */
export interface MockCollection {
  id: string
  title: string
  subtitle?: string
  cafeIds: string[]
}

export const mockCollections: MockCollection[] = [
  {
    id: 'col-1',
    title: 'Solid backups',
    subtitle: 'Chains that almost always have Wi-Fi and a seat',
    cafeIds: ['cafe-14', 'cafe-11', 'cafe-15', 'cafe-13', 'cafe-12'],
  },
  {
    id: 'col-2',
    title: 'TikTok found it first',
    subtitle: 'Trending before the lines get long',
    cafeIds: ['cafe-1', 'cafe-2', 'cafe-7', 'cafe-3', 'cafe-10'],
  },
  {
    id: 'col-3',
    title: 'Outlets everywhere',
    subtitle: 'Bring the laptop, skip the charger anxiety',
    cafeIds: ['cafe-2', 'cafe-4', 'cafe-9', 'cafe-14', 'cafe-8'],
  },
  {
    id: 'col-4',
    title: 'Quiet enough for calls',
    subtitle: 'Soft music, soft voices',
    cafeIds: ['cafe-9', 'cafe-2', 'cafe-6'],
  },
  {
    id: 'col-5',
    title: 'Always a seat',
    subtitle: 'Big rooms and long tables',
    cafeIds: ['cafe-4', 'cafe-9', 'cafe-14', 'cafe-8', 'cafe-11'],
  },
  {
    id: 'col-6',
    title: 'Matcha and a walk',
    subtitle: 'Order, then wander',
    cafeIds: ['cafe-1', 'cafe-7', 'cafe-10', 'cafe-5', 'cafe-13'],
  },
]
