import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

/** Mobile tab bar. Hidden from md up, where the top bar takes over. */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-nav md:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-caption font-semibold ${
                  isActive ? 'text-brand-dark' : 'text-ink-muted'
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
  )
}
