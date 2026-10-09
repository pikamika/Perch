import { useRef, useState } from 'react'
import { ChevronLeftIcon } from '../ui/icons'

interface Props {
  photos: string[]
  name: string
}

export function PhotoStrip({ photos, name }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  function handleScroll() {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  function goTo(next: number) {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(photos.length - 1, next))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const arrow =
    'absolute top-1/2 hidden h-touch w-touch -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 shadow-card hover:bg-surface md:flex'

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`Photos of ${name}`}
      className="relative overflow-hidden rounded-card bg-sand"
    >
      {/* A scrollable area must be keyboard-focusable so arrow keys can scroll it (WCAG 2.1.1). */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label={`Photo gallery for ${name}. Swipe or use the arrow keys.`}
        className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${name}: view ${i + 1} of ${photos.length}`}
            width={900}
            height={675}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {photos.length > 1 ? (
        <>
          <p
            className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-caption font-semibold text-white"
            aria-live="polite"
          >
            {index + 1} / {photos.length}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
            {photos.map((src, i) => (
              <span key={src} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
          {index > 0 ? (
            <button type="button" aria-label="Previous photo" onClick={() => goTo(index - 1)} className={`${arrow} left-3`}>
              <ChevronLeftIcon />
            </button>
          ) : null}
          {index < photos.length - 1 ? (
            <button type="button" aria-label="Next photo" onClick={() => goTo(index + 1)} className={`${arrow} right-3`}>
              <ChevronLeftIcon className="rotate-180" />
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
