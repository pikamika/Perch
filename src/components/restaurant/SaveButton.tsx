import { BookmarkIcon } from '../ui/icons'
import { Button } from '../ui/Button'

interface Props {
  saved: boolean
  pending?: boolean
  disabled?: boolean
  onToggle: () => void
}

export function SaveButton({ saved, pending = false, disabled = false, onToggle }: Props) {
  return (
    <Button
      variant={saved ? 'secondary' : 'primary'}
      aria-pressed={saved}
      disabled={disabled || pending}
      onClick={onToggle}
      className="w-full md:w-auto"
    >
      <BookmarkIcon filled={saved} />
      {pending ? 'Saving…' : saved ? 'Saved' : 'Save this place'}
    </Button>
  )
}
