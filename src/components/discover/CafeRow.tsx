import { useId } from 'react'
import type { Purpose, Cafe } from '../../types'
import { CafeTile } from '../cafe/CafeTile'
import { HorizontalScroller } from '../ui/HorizontalScroller'

interface Props {
  title: string
  subtitle?: string
  cafes: Cafe[]
  purpose?: Purpose
}

/** One DoorDash-style section: a heading and a swipeable row of tiles. */
export function CafeRow({ title, subtitle, cafes, purpose }: Props) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId}>
      <div className="mb-3">
        <h2 id={headingId} className="font-display text-title">
          {title}
        </h2>
        {subtitle ? <p className="text-ink-muted">{subtitle}</p> : null}
      </div>
      <HorizontalScroller label={title}>
        {cafes.map((cafe) => (
          <li key={cafe.id} className="w-[15rem] shrink-0 snap-start md:w-[17rem]">
            <CafeTile cafe={cafe} purpose={purpose} />
          </li>
        ))}
      </HorizontalScroller>
    </section>
  )
}
