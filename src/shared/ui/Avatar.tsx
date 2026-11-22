import { resolveAvatarUrl } from '@/shared/avatar'
import { getInitials } from '@/shared/utils'

type AvatarProps = {
  name: string
  photoDataUrl?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  ring?: boolean
}

const sizeClass = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-11 w-11 text-xs',
  lg: 'h-16 w-16 text-base',
  xl: 'h-28 w-28 text-2xl',
}

export function Avatar({
  name,
  photoDataUrl,
  initials,
  size = 'md',
  className = '',
  ring = true,
}: AvatarProps) {
  const src = resolveAvatarUrl(name, photoDataUrl)
  const label = initials || getInitials(name)

  return (
    <img
      src={src}
      alt={name}
      title={label}
      className={`${sizeClass[size]} shrink-0 rounded-full object-cover ${
        ring ? 'ring-2 ring-white shadow-md shadow-ink/10' : ''
      } ${className}`}
    />
  )
}
