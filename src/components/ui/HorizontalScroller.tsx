import { useRef, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface Props {
  /** The items; each should be an <li> with a fixed width. */
  children: ReactNode
  label: string
}

const arrow =
  'absolute top-1/3 z-10 hidden h-touch w-touch -translate-y-1/2 items-center justify-center rounded-full bg-surface shadow-card hover:bg-sand md:flex'

/** A swipeable row of cards (mouse users get arrow buttons from tablet width up). */
export function HorizontalScroller({ children, label }: Props) {
  const trackRef = useRef<HTMLUListElement>(null)

  function scrollBy(direction: 1 | -1) {
    const el = trackRef.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        aria-label={label}
        className="-mx-gutter flex snap-x gap-4 overflow-x-auto scroll-smooth px-gutter pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <button type="button" aria-label={`Scroll ${label} left`} onClick={() => scrollBy(-1)} className={`${arrow} left-2`}>
        <ChevronLeftIcon />
      </button>
      <button type="button" aria-label={`Scroll ${label} right`} onClick={() => scrollBy(1)} className={`${arrow} right-2`}>
        <ChevronRightIcon />
      </button>
    </div>
  )
}
