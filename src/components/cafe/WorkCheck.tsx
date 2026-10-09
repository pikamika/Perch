import { getWorkInfoFreshness } from '../../lib/freshness'
import {
  NOISE_LABEL,
  OUTLET_LABEL,
  SEATING_LABEL,
  WIFI_LABEL,
  WIFI_SPEED_LABEL,
} from '../../lib/work'
import type { Cafe } from '../../types'

type Rating = 'good' | 'ok' | 'bad'

/** The rating is shown with an icon as well as color, so it never relies on color alone. */
const RATING_ICON: Record<Rating, { icon: string; text: string }> = {
  good: { icon: '✅', text: 'Good' },
  ok: { icon: '⚠️', text: 'Okay' },
  bad: { icon: '❌', text: 'Not great' },
}

interface RowProps {
  emoji: string
  title: string
  value: string
  detail?: string
  rating?: Rating
}

function Row({ emoji, title, value, detail, rating }: RowProps) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span aria-hidden="true" className="text-2xl leading-none">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-semibold text-ink-muted">{title}</p>
        <p className="font-semibold">{value}</p>
        {detail ? <p className="text-caption text-ink-muted">{detail}</p> : null}
      </div>
      {rating ? (
        <span className="shrink-0 text-lg" role="img" aria-label={RATING_ICON[rating].text}>
          {RATING_ICON[rating].icon}
        </span>
      ) : null}
    </li>
  )
}

export function WorkCheck({ cafe }: { cafe: Cafe }) {
  const freshness = getWorkInfoFreshness(cafe.workInfoUpdatedAt)

  const wifiRating: Rating =
    cafe.wifi === 'free' ? (cafe.wifiSpeed === 'slow' ? 'ok' : 'good') : cafe.wifi === 'none' ? 'bad' : 'ok'
  const networkNote =
    cafe.wifi === 'none'
      ? null
      : cafe.wifi === 'free-with-purchase'
        ? 'Buy something to get the password'
        : cafe.wifiSecured
          ? 'Password-protected network'
          : 'Open network'
  const wifiDetail = [cafe.wifiSpeed ? `${WIFI_SPEED_LABEL[cafe.wifiSpeed]} connection` : null, networkNote]
    .filter(Boolean)
    .join(' · ')

  return (
    <section aria-labelledby="work-check-heading" className="rounded-card bg-surface p-4 shadow-card">
      <h2 id="work-check-heading" className="font-display text-title">
        Work check
      </h2>
      <ul className="mt-1 divide-y divide-line">
        <Row
          emoji="📶"
          title="Wi-Fi"
          value={WIFI_LABEL[cafe.wifi]}
          detail={wifiDetail || (cafe.wifi === 'none' ? 'Bring a hotspot' : undefined)}
          rating={wifiRating}
        />
        <Row
          emoji="🔌"
          title="Outlets"
          value={OUTLET_LABEL[cafe.outlets]}
          rating={cafe.outlets === 'plenty' ? 'good' : cafe.outlets === 'none' ? 'bad' : 'ok'}
        />
        <Row
          emoji="💺"
          title="Seating"
          value={SEATING_LABEL[cafe.seating]}
          rating={cafe.seating === 'plenty' ? 'good' : cafe.seating === 'limited' ? 'bad' : 'ok'}
        />
        <Row
          emoji="🔊"
          title="Noise"
          value={NOISE_LABEL[cafe.noise]}
          rating={cafe.noise === 'quiet' ? 'good' : cafe.noise === 'loud' ? 'bad' : 'ok'}
        />
        <Row
          emoji="💻"
          title="Laptops"
          value={cafe.laptopFriendly ? 'Laptop-friendly' : 'Laptops not really welcome'}
          rating={cafe.laptopFriendly ? 'good' : 'bad'}
        />
        <Row emoji="🌤️" title="Best time to work" value={cafe.bestTimeToWork} />
        <Row emoji="🚪" title="Busiest" value={cafe.busiestTimes} />
      </ul>
      <p
        className={`mt-2 rounded-chip px-3 py-2 text-caption font-semibold ${
          freshness.isFresh ? 'bg-accent-soft text-ink' : 'bg-sand text-ink-muted'
        }`}
      >
        <span aria-hidden="true">{freshness.isFresh ? '🕒' : '🕰️'} </span>
        {freshness.label}
      </p>
    </section>
  )
}
