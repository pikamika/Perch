interface Props {
  size?: 'sm' | 'lg'
  /** Accessible name; leave out when the avatar is purely decorative next to text. */
  label?: string
}

const sizes = { sm: 'h-11 w-11 text-2xl', lg: 'h-28 w-28 text-6xl' }

/** Everyone gets the same coffee cup. */
export function Avatar({ size = 'sm', label }: Props) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand ${sizes[size]}`}
    >
      <span aria-hidden="true">☕</span>
    </div>
  )
}
