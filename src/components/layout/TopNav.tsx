import { Link, NavLink } from 'react-router-dom'
import { APP_NAME } from '../../lib/brand'
import { NAV_ITEMS } from './navItems'

/** Tablet / desktop header with the same three destinations. */
export function TopNav() {
  return (
    <header className="hidden border-b border-line bg-surface md:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-gutter py-2">
        <Link to="/" className="inline-flex min-h-touch items-center font-display text-lead font-bold text-brand-dark">
          {APP_NAME}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex min-h-touch items-center gap-2 rounded-chip px-4 font-semibold ${
                      isActive ? 'bg-brand-soft text-brand-dark' : 'text-ink-muted hover:bg-sand'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
