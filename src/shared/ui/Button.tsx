import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-forest text-white hover:bg-forest-mid shadow-sm shadow-forest/15 disabled:opacity-50',
  secondary:
    'bg-white text-ink hover:bg-paper-deep border border-sand-light',
  ghost: 'bg-transparent text-ink-muted hover:bg-paper-deep hover:text-ink',
  danger: 'bg-clay text-white hover:bg-clay/90',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
