import { IconMapPinFilled } from '@tabler/icons-react'
import { Icon } from '@/components/index'

export const MapMarker = () => (
  <Icon
    className="map-marker-icon"
    style={{
      transform: 'translateY(-50%)',
      color:
        'var(--utrecht-map-marker-background-color, var(--utrecht-icon-color, currentColor))',
    }}
  >
    <IconMapPinFilled color="currentColor" />
  </Icon>
)
