import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const fieldClass =
  'w-full rounded-lg border border-sand/50 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/60 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/30'

type FieldProps = {
  label: string
  hint?: string
  error?: string
}

export function TextField({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? props.name
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input id={fieldId} className={fieldClass} {...props} />
      {hint && !error ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </label>
  )
}

export function TextAreaField({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? props.name
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        id={fieldId}
        className={`${fieldClass} min-h-24 resize-y`}
        {...props}
      />
      {hint && !error ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </label>
  )
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className = '',
  children,
  ...props
}: FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode
  }) {
  const fieldId = id ?? props.name
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <select id={fieldId} className={fieldClass} {...props}>
        {children}
      </select>
      {hint && !error ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </label>
  )
}
