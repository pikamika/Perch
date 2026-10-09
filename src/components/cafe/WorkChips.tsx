import { OUTLET_SHORT, SEATING_SHORT, WIFI_SHORT } from '../../lib/work'
import type { Cafe } from '../../types'

/** The three facts a remote worker checks first, readable at a glance. */
export function WorkChips({ cafe }: { cafe: Cafe }) {
  const items = [
    { emoji: '📶', name: 'Wi-Fi', value: WIFI_SHORT[cafe.wifi] },
    { emoji: '🔌', name: 'Outlets', value: OUTLET_SHORT[cafe.outlets] },
    { emoji: '💺', name: 'Seating', value: SEATING_SHORT[cafe.seating] },
  ]
  return (
    <ul aria-label="Work details" className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-caption text-ink">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-1">
          <span aria-hidden="true">{item.emoji}</span>
          <span className="sr-only">{item.name}: </span>
          <span className="font-semibold">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
