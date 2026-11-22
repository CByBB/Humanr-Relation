type IconProps = { className?: string }

export function IconMap({ className = 'nav-icon' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 4v13.5M15 6.5V20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconPeople({ className = 'nav-icon' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 14.2c1.5-.7 3.2-.5 4.7.8.7.6 1.2 1.4 1.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconLinks({ className = 'nav-icon' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.2 8.5 14.8 8.5M8.2 9.2 10.8 14.8M15.8 9.2 13.2 14.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconMemories({ className = 'nav-icon' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 9.5h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" />
      <path
        d="M11 16.5 13.2 13.8l2 1.7 2.3-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconSettings({ className = 'nav-icon' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
