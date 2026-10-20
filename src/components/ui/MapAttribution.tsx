import {
  AttributionControl,
  type AttributionControlProps,
} from 'react-map-gl/maplibre'

const MapAttribution = ({
  customAttribution,
}: Pick<AttributionControlProps, 'customAttribution'>) => {
  return (
    <AttributionControl
      key={String(customAttribution)}
      customAttribution={customAttribution}
      position="bottom-right"
    />
  )
}

export { MapAttribution }
