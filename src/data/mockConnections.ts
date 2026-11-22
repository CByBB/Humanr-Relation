import type { Connection } from '@/shared/types'

const ts = '2024-06-01T12:00:00.000Z'

/** Demo links between mock people (ids match mockPeople). */
export const mockConnections: Connection[] = [
  {
    id: 'c-sofia-elena',
    fromId: 'p-sofia',
    toId: 'p-elena',
    kind: 'friend',
    notes: 'Se conocieron en un intercambio académico.',
    createdAt: ts,
  },
  {
    id: 'c-sofia-noah',
    fromId: 'p-sofia',
    toId: 'p-noah',
    kind: 'met',
    label: 'Viaje',
    notes: 'Couchsurfing en Berlín.',
    createdAt: ts,
  },
  {
    id: 'c-elena-kenji',
    fromId: 'p-elena',
    toId: 'p-kenji',
    kind: 'work',
    notes: 'Colaboración remota en tipografía digital.',
    createdAt: ts,
  },
  {
    id: 'c-kenji-maya',
    fromId: 'p-kenji',
    toId: 'p-maya',
    kind: 'work',
    createdAt: ts,
  },
  {
    id: 'c-maya-priya',
    fromId: 'p-maya',
    toId: 'p-priya',
    kind: 'work',
    notes: 'Equipo de datos compartido.',
    createdAt: ts,
  },
  {
    id: 'c-lucas-omar',
    fromId: 'p-lucas',
    toId: 'p-omar',
    kind: 'friend',
    createdAt: ts,
  },
  {
    id: 'c-omar-noah',
    fromId: 'p-omar',
    toId: 'p-noah',
    kind: 'friend',
    createdAt: ts,
  },
  {
    id: 'c-diego-sofia',
    fromId: 'p-diego',
    toId: 'p-sofia',
    kind: 'family',
    label: 'Primo',
    createdAt: ts,
  },
  {
    id: 'c-amara-priya',
    fromId: 'p-amara',
    toId: 'p-priya',
    kind: 'met',
    notes: 'Conferencia internacional.',
    createdAt: ts,
  },
]
