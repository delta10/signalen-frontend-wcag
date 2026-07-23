import { useConfig } from '@/contexts/ConfigContext'
import { MapLayer } from '@/app/[locale]/incident/add/components/MapLayer'

export const MapLayers = () => {
  const config = useConfig()
  const layers = config.base.map.layers ?? []

  return layers.map((layer) => <MapLayer key={layer.id} layer={layer} />)
}