/**
 * Single place that decides where cafe photos come from.
 * Swap this for real image URLs (or Supabase Storage) later.
 * Uses picsum.photos: seeded, so the same seed always gives the same image.
 */
export function placeholderPhoto(seed: string, width = 900, height = 700): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

export function placeholderPhotos(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => placeholderPhoto(`${slug}-${i + 1}`))
}
