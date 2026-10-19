import { useEffect } from 'react'
import {
  AttributionControl,
  type AttributionControlProps,
  useMap,
} from 'react-map-gl/maplibre'
import { useMediaQuery } from 'usehooks-ts'

const MapAttribution = ({
  customAttribution,
}: Pick<AttributionControlProps, 'customAttribution'>) => {
  const { current: map } = useMap()
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!isMobile) return

    // MapLibre 4 initially expands compact controls. Collapse once content exists.
    const collapseInitially = () => {
      queueMicrotask(() => {
        const control = map
          ?.getContainer()
          .querySelector<HTMLDetailsElement>('.maplibregl-ctrl-attrib')
        if (!control || control.classList.contains('maplibregl-attrib-empty'))
          return
        control.classList.remove('maplibregl-compact-show')
        control.open = false
        map?.off('sourcedata', collapseInitially)
      })
    }

    map?.on('sourcedata', collapseInitially)
    collapseInitially()
    return () => {
      map?.off('sourcedata', collapseInitially)
    }
  }, [map, isMobile, customAttribution])

  return (
    <AttributionControl
      key={`${isMobile}:${customAttribution}`}
      customAttribution={customAttribution}
      compact={isMobile}
      position="bottom-right"
    />
  )
}

export { MapAttribution }
