import type { Dish } from '../../types'

export function WhatToOrder({ dishes }: { dishes: Dish[] }) {
  return (
    <section aria-labelledby="order-heading">
      <h2 id="order-heading" className="mb-3 font-display text-title">
        What to order
      </h2>
      <ol className="space-y-2">
        {dishes.map((dish, index) => (
          <li key={dish.name} className="flex gap-3 rounded-chip bg-surface p-3 shadow-card">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-bold"
            >
              {index + 1}
            </span>
            <div>
              <p className="font-semibold">{dish.name}</p>
              {dish.note ? <p className="text-caption text-ink-muted">{dish.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
