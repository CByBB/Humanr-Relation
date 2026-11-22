import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { peopleRepository } from '@/features/storage/peopleRepository'
import type { AppState, Connection, Person } from '@/shared/types'
import { normalizeName } from '@/shared/utils'

type PeopleContextValue = {
  people: Person[]
  connections: Connection[]
  refresh: () => void
  getPerson: (id: string) => Person | undefined
  createPerson: (
    input: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Person
  updatePerson: (id: string, patch: Partial<Person>) => Person | undefined
  removePerson: (id: string) => boolean
  findDuplicates: (name: string, excludeId?: string) => Person[]
  createConnection: (
    input: Omit<Connection, 'id' | 'createdAt'>,
  ) => Connection
  removeConnection: (id: string) => boolean
  exportState: () => AppState
  importState: (state: AppState) => void
  resetDemo: () => void
}

const PeopleContext = createContext<PeopleContextValue | null>(null)

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(() => peopleRepository.list())
  const [connections, setConnections] = useState<Connection[]>(() =>
    peopleRepository.listConnections(),
  )

  const refresh = useCallback(() => {
    setPeople(peopleRepository.list())
    setConnections(peopleRepository.listConnections())
  }, [])

  const getPerson = useCallback(
    (id: string) => people.find((p) => p.id === id),
    [people],
  )

  const createPerson = useCallback(
    (input: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
      const person = peopleRepository.create(input)
      refresh()
      return person
    },
    [refresh],
  )

  const updatePerson = useCallback(
    (id: string, patch: Partial<Person>) => {
      const person = peopleRepository.update(id, patch)
      refresh()
      return person
    },
    [refresh],
  )

  const removePerson = useCallback(
    (id: string) => {
      const ok = peopleRepository.remove(id)
      refresh()
      return ok
    },
    [refresh],
  )

  const findDuplicates = useCallback(
    (name: string, excludeId?: string) => {
      const normalized = normalizeName(name)
      if (!normalized) return []
      return people.filter(
        (p) =>
          p.id !== excludeId && normalizeName(p.name) === normalized,
      )
    },
    [people],
  )

  const createConnection = useCallback(
    (input: Omit<Connection, 'id' | 'createdAt'>) => {
      const connection = peopleRepository.createConnection(input)
      refresh()
      return connection
    },
    [refresh],
  )

  const removeConnection = useCallback(
    (id: string) => {
      const ok = peopleRepository.removeConnection(id)
      refresh()
      return ok
    },
    [refresh],
  )

  const exportState = useCallback(() => peopleRepository.exportState(), [])

  const importState = useCallback(
    (state: AppState) => {
      peopleRepository.importState(state)
      refresh()
    },
    [refresh],
  )

  const resetDemo = useCallback(() => {
    peopleRepository.resetDemo()
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      people,
      connections,
      refresh,
      getPerson,
      createPerson,
      updatePerson,
      removePerson,
      findDuplicates,
      createConnection,
      removeConnection,
      exportState,
      importState,
      resetDemo,
    }),
    [
      people,
      connections,
      refresh,
      getPerson,
      createPerson,
      updatePerson,
      removePerson,
      findDuplicates,
      createConnection,
      removeConnection,
      exportState,
      importState,
      resetDemo,
    ],
  )

  return (
    <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>
  )
}

export function usePeople() {
  const ctx = useContext(PeopleContext)
  if (!ctx) throw new Error('usePeople debe usarse dentro de PeopleProvider')
  return ctx
}
