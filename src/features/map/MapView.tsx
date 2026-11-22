import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import Supercluster from 'supercluster'
import { resolveAvatarUrl } from '@/shared/avatar'
import type { Person } from '@/shared/types'
import { primaryLocation } from '@/shared/utils'

type MapPointProps = {
  personId: string
}

type MapViewProps = {
  people: Person[]
  selectedId?: string | null
  onSelectPerson: (person: Person) => void
}

function createPersonIcon(person: Person, selected: boolean) {
  const src = resolveAvatarUrl(person.name, person.photoDataUrl)
  const safeName = person.name
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')

  return L.divIcon({
    className: selected ? 'hm-marker hm-marker-selected' : 'hm-marker',
    iconSize: [52, 64],
    iconAnchor: [26, 62],
    html: `
      <button type="button" class="hm-marker-btn" title="${safeName}" aria-label="${safeName}">
        <span class="hm-marker-pin">
          <span class="hm-marker-avatar">
            <img src="${src}" alt="" draggable="false" />
          </span>
          <span class="hm-marker-tip" aria-hidden="true"></span>
        </span>
        <span class="hm-marker-label">${safeName}</span>
      </button>
    `,
  })
}

function createClusterIcon(count: number, previewUrls: string[]) {
  const size = count > 20 ? 58 : count > 8 ? 52 : 46
  const previews = previewUrls.slice(0, 3)
  const images =
    previews.length > 0
      ? `<span class="hm-cluster-faces">${previews
          .map(
            (url) =>
              `<img src="${url}" alt="" style="width:${100 / previews.length}%" />`,
          )
          .join('')}<span class="hm-cluster-count">${count}</span></span>`
      : `<span class="hm-cluster-count-only">${count}</span>`

  return L.divIcon({
    className: 'hm-cluster',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<button type="button" class="hm-cluster-btn" style="width:${size}px;height:${size}px" aria-label="Grupo de ${count} personas">${images}</button>`,
  })
}

function MapEvents({
  onBoundsZoom,
}: {
  onBoundsZoom: (bbox: [number, number, number, number], zoom: number) => void
}) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds()
      onBoundsZoom(
        [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
        map.getZoom(),
      )
    },
    zoomend() {
      const b = map.getBounds()
      onBoundsZoom(
        [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
        map.getZoom(),
      )
    },
  })

  useEffect(() => {
    const b = map.getBounds()
    onBoundsZoom(
      [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
      map.getZoom(),
    )
  }, [map, onBoundsZoom])

  return null
}

function FitOnPeople({ people }: { people: Person[] }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (fitted.current || people.length === 0) return
    const pts = people
      .map((p) => primaryLocation(p))
      .filter(Boolean)
      .map((l) => [l!.lat, l!.lng] as [number, number])
    if (pts.length === 0) return
    const bounds = L.latLngBounds(pts)
    map.fitBounds(bounds.pad(0.25), { maxZoom: 4, animate: false })
    fitted.current = true
  }, [map, people])

  return null
}

function ClusterMarker({
  lat,
  lng,
  count,
  previewUrls,
  expansionZoom,
}: {
  lat: number
  lng: number
  count: number
  previewUrls: string[]
  expansionZoom: number
}) {
  const map = useMap()
  return (
    <Marker
      position={[lat, lng]}
      icon={createClusterIcon(count, previewUrls)}
      eventHandlers={{
        click: (e) => {
          e.originalEvent.stopPropagation()
          map.flyTo([lat, lng], expansionZoom, { duration: 0.45 })
        },
      }}
    />
  )
}

export function MapView({
  people,
  selectedId,
  onSelectPerson,
}: MapViewProps) {
  const [bbox, setBbox] = useState<[number, number, number, number]>([
    -180, -85, 180, 85,
  ])
  const [zoom, setZoom] = useState(2)

  const peopleById = useMemo(() => {
    const lookup = new globalThis.Map<string, Person>()
    for (const p of people) lookup.set(p.id, p)
    return lookup
  }, [people])

  const index = useMemo(() => {
    const cluster = new Supercluster<MapPointProps, MapPointProps>({
      radius: 62,
      maxZoom: 14,
    })
    const points = people.flatMap((person) => {
      const loc = primaryLocation(person)
      if (!loc) return []
      return [
        {
          type: 'Feature' as const,
          properties: { personId: person.id },
          geometry: {
            type: 'Point' as const,
            coordinates: [loc.lng, loc.lat] as [number, number],
          },
        },
      ]
    })
    cluster.load(points)
    return cluster
  }, [people])

  const clusters = useMemo(
    () => index.getClusters(bbox, Math.round(zoom)),
    [index, bbox, zoom],
  )

  const handleBoundsZoom = useMemo(
    () => (nextBbox: [number, number, number, number], nextZoom: number) => {
      setBbox(nextBbox)
      setZoom(nextZoom)
    },
    [],
  )

  return (
    <MapContainer
      center={[22, 12]}
      zoom={2}
      minZoom={1}
      maxZoom={18}
      scrollWheelZoom
      className="h-full w-full"
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onBoundsZoom={handleBoundsZoom} />
      <FitOnPeople people={people} />

      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates
        const props = feature.properties

        if (props && 'cluster' in props && props.cluster) {
          const clusterId = props.cluster_id as number
          const count = props.point_count as number
          const leaves = index.getLeaves(clusterId, 3)
          const previewUrls = leaves
            .map((leaf) => {
              const person = peopleById.get(leaf.properties.personId)
              return person
                ? resolveAvatarUrl(person.name, person.photoDataUrl)
                : null
            })
            .filter((u): u is string => Boolean(u))

          return (
            <ClusterMarker
              key={`cluster-${clusterId}`}
              lat={lat}
              lng={lng}
              count={count}
              previewUrls={previewUrls}
              expansionZoom={Math.min(
                index.getClusterExpansionZoom(clusterId),
                16,
              )}
            />
          )
        }

        const person = peopleById.get((props as MapPointProps).personId)
        if (!person) return null

        return (
          <Marker
            key={`person-${person.id}`}
            position={[lat, lng]}
            icon={createPersonIcon(person, selectedId === person.id)}
            zIndexOffset={selectedId === person.id ? 1000 : 0}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation()
                onSelectPerson(person)
              },
            }}
          />
        )
      })}
    </MapContainer>
  )
}
