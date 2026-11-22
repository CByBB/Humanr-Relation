import { Link } from 'react-router-dom'

type BrandLogoProps = {
  to?: string
  showTagline?: boolean
  className?: string
  compact?: boolean
  /** light = for dark sidebar; dark = for light header */
  tone?: 'light' | 'dark'
}

export function BrandLogo({
  to = '/',
  showTagline = false,
  className = '',
  compact = false,
  tone = 'light',
}: BrandLogoProps) {
  const titleClass = tone === 'light' ? 'text-white' : 'text-forest'
  const taglineClass = tone === 'light' ? 'text-sand-light/65' : 'text-ink-muted'
  const markSize = compact ? 'h-7 w-7' : 'h-9 w-9'
  const textSize = compact ? 'text-lg' : 'text-[1.35rem]'

  return (
    <Link
      to={to}
      className={`group inline-flex max-w-full flex-col gap-1 ${className}`}
    >
      <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <img
          src="/favicon.svg"
          alt=""
          className={`${markSize} shrink-0 rounded-full shadow-sm ring-1 ring-white/25 transition group-hover:scale-105`}
        />
        <span
          className={`font-display ${textSize} font-semibold uppercase leading-none tracking-[0.06em] ${titleClass}`}
        >
          HUMAN MAP
        </span>
      </span>
      {showTagline ? (
        <span
          className={`w-full text-[11px] tracking-wide ${taglineClass} ${
            compact ? '' : 'sm:pl-11'
          }`}
        >
          personas · lugares · recuerdos
        </span>
      ) : null}
    </Link>
  )
}
