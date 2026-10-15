import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  /** Shown inside the right edge of the input, e.g. a show/hide password button. */
  endAdornment?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, hint, error, endAdornment, ref, className = '', readOnly, ...props }: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`min-h-touch w-full rounded-chip border-2 px-4 text-body placeholder:text-ink-muted ${
            readOnly ? 'cursor-default border-line bg-sand text-ink-muted' : 'bg-surface'
          } ${error ? 'border-danger' : readOnly ? '' : 'border-line'} ${endAdornment ? 'pr-14' : ''} ${className}`}
          {...props}
        />
        {endAdornment ? <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div> : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-caption font-semibold text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-caption font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
