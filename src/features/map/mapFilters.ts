import type { MapFilters, Person } from '@/shared/types'
import { primaryLocation } from '@/shared/utils'

export const emptyFilters: MapFilters = {
  country: '',
  city: '',
  tag: '',
}

export function filterPeople(
  people: Person[],
  filters: MapFilters,
): Person[] {
  return people.filter((person) => {
    if (filters.tag) {
      const tag = filters.tag.toLowerCase()
      if (!person.tags.some((t) => t.toLowerCase() === tag)) return false
    }

    const locations =
      filters.country || filters.city
        ? person.locations
        : [primaryLocation(person)].filter(Boolean)

    if (filters.country) {
      const country = filters.country.toLowerCase()
      if (
        !locations.some(
          (l) => l && l.country?.toLowerCase() === country,
        )
      ) {
        return false
      }
    }

    if (filters.city) {
      const city = filters.city.toLowerCase()
      if (
        !locations.some((l) => l && l.city?.toLowerCase() === city)
      ) {
        return false
      }
    }

    return true
  })
}

export function collectFilterOptions(people: Person[]) {
  const countries = new Set<string>()
  const cities = new Set<string>()
  const tags = new Set<string>()

  for (const person of people) {
    for (const tag of person.tags) tags.add(tag)
    for (const loc of person.locations) {
      if (loc.country) countries.add(loc.country)
      if (loc.city) cities.add(loc.city)
    }
  }

  return {
    countries: [...countries].sort((a, b) => a.localeCompare(b, 'es')),
    cities: [...cities].sort((a, b) => a.localeCompare(b, 'es')),
    tags: [...tags].sort((a, b) => a.localeCompare(b, 'es')),
  }
}
