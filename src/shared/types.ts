export type LocationKind =
  | 'current_residence'
  | 'previous_residence'
  | 'hometown'
  | 'workplace'
  | 'met_at'

export type PersonLocation = {
  id: string
  kind: LocationKind
  label: string
  lat: number
  lng: number
  country?: string
  city?: string
  startDate?: string
  endDate?: string
}

export type Person = {
  id: string
  name: string
  photoDataUrl?: string
  initials?: string
  email?: string
  phone?: string
  birthday?: string
  notes?: string
  tags: string[]
  locations: PersonLocation[]
  createdAt: string
  updatedAt: string
}

export type RelationKind =
  | 'family'
  | 'friend'
  | 'work'
  | 'met'
  | 'custom'

export type Connection = {
  id: string
  fromId: string
  toId: string
  kind: RelationKind
  label?: string
  notes?: string
  createdAt: string
}

export type AppState = {
  people: Person[]
  connections: Connection[]
  version: number
}

export type MapFilters = {
  country: string
  city: string
  tag: string
}

export const LOCATION_KIND_LABELS: Record<LocationKind, string> = {
  current_residence: 'Residencia actual',
  previous_residence: 'Residencia anterior',
  hometown: 'Ciudad de origen',
  workplace: 'Lugar de trabajo',
  met_at: 'Donde nos conocimos',
}

export const RELATION_KIND_LABELS: Record<RelationKind, string> = {
  family: 'Familiar',
  friend: 'Amistad',
  work: 'Laboral',
  met: 'Conocido',
  custom: 'Personalizado',
}

export const APP_STORAGE_KEY = 'human-map:v1'
export const APP_STATE_VERSION = 2
