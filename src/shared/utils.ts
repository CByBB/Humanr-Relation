import type { Person, PersonLocation } from './types'

export function createId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
}

export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function primaryLocation(person: Person): PersonLocation | undefined {
  return (
    person.locations.find((l) => l.kind === 'current_residence') ??
    person.locations[0]
  )
}

export function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export async function fileToResizedDataUrl(
  file: File,
  maxSize = 256,
): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
