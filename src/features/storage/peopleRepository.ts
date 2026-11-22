import { mockConnections } from '@/data/mockConnections'
import { mockPeople } from '@/data/mockPeople'
import {
  APP_STATE_VERSION,
  APP_STORAGE_KEY,
  type AppState,
  type Connection,
  type Person,
} from '@/shared/types'
import { createId, nowIso } from '@/shared/utils'

function seedState(): AppState {
  return {
    people: structuredClone(mockPeople),
    connections: structuredClone(mockConnections),
    version: APP_STATE_VERSION,
  }
}

function normalizeState(parsed: Partial<AppState>): AppState {
  const people = Array.isArray(parsed.people) ? parsed.people : []
  let connections = Array.isArray(parsed.connections)
    ? parsed.connections
    : []

  // Migrate older local saves that had people but no connections.
  if (
    connections.length === 0 &&
    people.length > 0 &&
    (parsed.version ?? 1) < 2
  ) {
    const ids = new Set(people.map((p) => p.id))
    connections = structuredClone(mockConnections).filter(
      (c) => ids.has(c.fromId) && ids.has(c.toId),
    )
  }

  return {
    people,
    connections,
    version: APP_STATE_VERSION,
  }
}

function readState(): AppState {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY)
    if (!raw) {
      const seeded = seedState()
      writeState(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (!parsed.people || !Array.isArray(parsed.people)) {
      throw new Error('Estado inválido')
    }
    const normalized = normalizeState(parsed)
    if (
      !Array.isArray((parsed as AppState).connections) ||
      (parsed.version ?? 1) < 2
    ) {
      writeState(normalized)
    }
    return normalized
  } catch {
    const seeded = seedState()
    writeState(seeded)
    return seeded
  }
}

function writeState(state: AppState): void {
  localStorage.setItem(
    APP_STORAGE_KEY,
    JSON.stringify({
      ...state,
      version: APP_STATE_VERSION,
    }),
  )
}

export type PeopleRepository = {
  list: () => Person[]
  get: (id: string) => Person | undefined
  create: (input: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Person
  update: (id: string, patch: Partial<Person>) => Person | undefined
  remove: (id: string) => boolean
  replaceAll: (people: Person[]) => void
  listConnections: () => Connection[]
  createConnection: (
    input: Omit<Connection, 'id' | 'createdAt'>,
  ) => Connection
  removeConnection: (id: string) => boolean
  exportState: () => AppState
  importState: (state: AppState) => void
  resetDemo: () => void
}

export const peopleRepository: PeopleRepository = {
  list() {
    return readState().people
  },

  get(id) {
    return readState().people.find((p) => p.id === id)
  },

  create(input) {
    const state = readState()
    const person: Person = {
      ...input,
      id: createId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    state.people = [...state.people, person]
    writeState(state)
    return person
  },

  update(id, patch) {
    const state = readState()
    const index = state.people.findIndex((p) => p.id === id)
    if (index < 0) return undefined
    const current = state.people[index]!
    const updated: Person = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    }
    state.people = [
      ...state.people.slice(0, index),
      updated,
      ...state.people.slice(index + 1),
    ]
    writeState(state)
    return updated
  },

  remove(id) {
    const state = readState()
    const next = state.people.filter((p) => p.id !== id)
    if (next.length === state.people.length) return false
    state.people = next
    state.connections = state.connections.filter(
      (c) => c.fromId !== id && c.toId !== id,
    )
    writeState(state)
    return true
  },

  replaceAll(people) {
    const state = readState()
    writeState({ ...state, people })
  },

  listConnections() {
    return readState().connections
  },

  createConnection(input) {
    const state = readState()
    const connection: Connection = {
      ...input,
      id: createId(),
      createdAt: nowIso(),
    }
    state.connections = [...state.connections, connection]
    writeState(state)
    return connection
  },

  removeConnection(id) {
    const state = readState()
    const next = state.connections.filter((c) => c.id !== id)
    if (next.length === state.connections.length) return false
    state.connections = next
    writeState(state)
    return true
  },

  exportState() {
    return readState()
  },

  importState(state) {
    if (!state.people || !Array.isArray(state.people)) {
      throw new Error('Archivo inválido: falta la lista de personas')
    }
    writeState(
      normalizeState({
        people: state.people,
        connections: state.connections ?? [],
        version: state.version,
      }),
    )
  },

  resetDemo() {
    writeState(seedState())
  },
}
