import { workVerdict } from '../../lib/work'
import type { Cafe } from '../../types'

const tones = {
  great: 'bg-success/15 text-success',
  okay: 'bg-accent-soft text-ink',
  quick: 'bg-sand text-ink-muted',
}

export function WorkVerdictBadge({ cafe }: { cafe: Cafe }) {
  const verdict = workVerdict(cafe)
  return (
    <p className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-bold ${tones[verdict.tone]}`}>
      <span aria-hidden="true">{verdict.emoji}</span>
      {verdict.label}
    </p>
  )
}
