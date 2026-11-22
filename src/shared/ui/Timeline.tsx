import type { ReactNode } from 'react'

export type TimelineItem = {
  id: string
  marker: ReactNode
  content: ReactNode
}

type TimelineProps = {
  items: TimelineItem[]
  className?: string
}

/** Vertical timeline with markers centered on the rail. */
export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <ol className={`hm-timeline ${className}`}>
      {items.map((item, index) => (
        <li key={item.id} className="hm-timeline-item">
          {index < items.length - 1 ? (
            <span className="hm-timeline-rail" aria-hidden />
          ) : null}
          <span className="hm-timeline-marker">{item.marker}</span>
          <div className="hm-timeline-body">{item.content}</div>
        </li>
      ))}
    </ol>
  )
}
