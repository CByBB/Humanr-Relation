import { useMemo, useState } from 'react'
import { MapFiltersBar } from '@/features/map/MapFiltersBar'
import { MapView } from '@/features/map/MapView'
import {
  collectFilterOptions,
  emptyFilters,
  filterPeople,
} from '@/features/map/mapFilters'
import { PersonDrawer } from '@/features/people/PersonDrawer'
import { usePeople } from '@/features/people/PeopleContext'
import type { MapFilters, Person } from '@/shared/types'

export function MapPage() {
  const { people } = usePeople()
  const [filters, setFilters] = useState<MapFilters>(emptyFilters)
  const [selected, setSelected] = useState<Person | null>(null)

  const options = useMemo(() => collectFilterOptions(people), [people])
  const filtered = useMemo(
    () => filterPeople(people, filters),
    [people, filters],
  )

  return (
    <div className="relative min-h-[calc(100dvh-7.5rem)] flex-1 overflow-hidden md:min-h-0">
      {/* isolate keeps Leaflet's high internal z-indexes below app chrome */}
      <div className="absolute inset-0 z-0 isolate">
        <MapView
          people={filtered}
          selectedId={selected?.id}
          onSelectPerson={setSelected}
        />
      </div>
      <div className="map-vignette pointer-events-none absolute inset-0 z-[1]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 md:p-4">
        <div className="mx-auto max-w-3xl">
          <MapFiltersBar
            filters={filters}
            countries={options.countries}
            cities={options.cities}
            tags={options.tags}
            count={filtered.length}
            onChange={setFilters}
          />
        </div>
      </div>

      <PersonDrawer person={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
