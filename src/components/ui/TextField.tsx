import { useId, type InputHTMLAttributes, type Ref } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, hint, error, ref, className = '', ...props }: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mb-2 text-caption text-ink-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-touch w-full rounded-chip border-2 bg-surface px-4 text-body placeholder:text-ink-muted/70 ${
          error ? 'border-danger' : 'border-line'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-caption font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
