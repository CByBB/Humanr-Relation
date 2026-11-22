import { getInitials } from './utils'

const PALETTES = [
  { bg: '#163a40', mid: '#2a6b73', fg: '#e8f4f2' },
  { bg: '#1f3d5c', mid: '#3d6f9c', fg: '#eaf2fa' },
  { bg: '#2d3a4a', mid: '#5a6f85', fg: '#eef2f6' },
  { bg: '#1e4034', mid: '#3d7a62', fg: '#e8f5ef' },
  { bg: '#3d2f28', mid: '#8a6a52', fg: '#f7efe7' },
  { bg: '#2a3850', mid: '#5b7aa8', fg: '#eaf0f8' },
  { bg: '#4a3030', mid: '#9a5e5e', fg: '#f8ecec' },
  { bg: '#243d3d', mid: '#4f8a86', fg: '#e8f4f3' },
  { bg: '#342848', mid: '#6f5a95', fg: '#f1ebf8' },
  { bg: '#2f3a24', mid: '#6a8548', fg: '#eef4e6' },
  { bg: '#3a3220', mid: '#8a7345', fg: '#f6f0e4' },
  { bg: '#203848', mid: '#4a7ea0', fg: '#e8f1f7' },
]

export function hashName(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h
}

export function avatarPalette(name: string) {
  return PALETTES[hashName(name) % PALETTES.length]!
}

/** Soft monogram portrait — unique colors per name. */
export function generateAvatarDataUrl(name: string, size = 128): string {
  const palette = avatarPalette(name)
  const initials = getInitials(name)
  const h = hashName(name)
  const uid = `a${h.toString(16)}`
  const angle = 35 + (h % 40)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="${uid}-g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${palette.bg}"/>
      <stop offset="55%" stop-color="${palette.mid}"/>
      <stop offset="100%" stop-color="${palette.bg}"/>
    </linearGradient>
    <radialGradient id="${uid}-shine" cx="32%" cy="28%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${uid}-c"><circle cx="64" cy="64" r="64"/></clipPath>
  </defs>
  <g clip-path="url(#${uid}-c)">
    <rect width="128" height="128" fill="url(#${uid}-g)"/>
    <circle cx="64" cy="64" r="64" fill="url(#${uid}-shine)"/>
    <circle cx="96" cy="20" r="36" fill="#ffffff" opacity="0.06"/>
    <circle cx="18" cy="100" r="28" fill="#000000" opacity="0.08"/>
    <text x="64" y="72" text-anchor="middle" font-family="Georgia,'Instrument Serif',serif" font-size="42" font-weight="600" fill="${palette.fg}" letter-spacing="1">${initials}</text>
  </g>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function resolveAvatarUrl(
  name: string,
  photoDataUrl?: string,
): string {
  return photoDataUrl || generateAvatarDataUrl(name)
}
