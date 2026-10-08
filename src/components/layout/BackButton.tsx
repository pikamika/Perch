import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../ui/icons'

const classes =
  '-ml-2 mb-3 inline-flex min-h-touch items-center gap-1 rounded-chip px-2 font-semibold text-brand-dark hover:bg-brand-soft'

/** Goes back in history, or to Home when the page was opened directly. */
export function BackButton({ fallbackTo = '/', label = 'Back' }: { fallbackTo?: string; label?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const canGoBack = location.key !== 'default'

  if (canGoBack) {
    return (
      <button type="button" onClick={() => navigate(-1)} className={classes}>
        <ChevronLeftIcon />
        {label}
      </button>
    )
  }
  return (
    <Link to={fallbackTo} className={classes}>
      <ChevronLeftIcon />
      {label}
    </Link>
  )
}
