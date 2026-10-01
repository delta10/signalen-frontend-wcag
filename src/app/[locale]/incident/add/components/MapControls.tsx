import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import { IconInfoCircle, IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components'
import { MapAttribution } from '@/components/ui/MapAttribution'
import { MapStyleSwitcher } from '@/app/[locale]/incident/add/components/MapStyleSwitcher'
import { getMapAttribution } from '@/lib/utils/map'
import type { AppConfig } from '@/types/config'

type MapControlsProps = {
  children: ReactNode
  config: AppConfig
  map?: MapRef | null
  aerialPhotoEnabled: boolean
  isAerialPhoto: boolean
  setIsAerialPhoto: (isAerialPhoto: boolean) => void
  hasLegendItems: boolean
  openLegend: boolean
  setOpenLegend: Dispatch<SetStateAction<boolean>>
  mobile?: boolean
  mobileAssetListControl?: ReactNode
  mobileCurrentLocationControl?: ReactNode
}

export const MapControls = ({
  children,
  config,
  map,
  aerialPhotoEnabled,
  isAerialPhoto,
  setIsAerialPhoto,
  hasLegendItems,
  openLegend,
  setOpenLegend,
  mobile = false,
  mobileAssetListControl,
  mobileCurrentLocationControl,
}: MapControlsProps) => {
  const t = useTranslations('describe_add.map')

  const styleSwitcher = aerialPhotoEnabled ? (
    <MapStyleSwitcher
      isAerialPhoto={isAerialPhoto}
      setIsAerialPhoto={setIsAerialPhoto}
      mobile={mobile}
    />
  ) : null

  const legendButton = hasLegendItems ? (
    <Button
      className={mobile ? 'map-icon-button mobile' : undefined}
      purpose="secondary"
      onClick={() => setOpenLegend(!openLegend)}
      iconStart={<IconInfoCircle />}
    >
      {t('legend')}
    </Button>
  ) : null

  return (
    <>
      {styleSwitcher && !hasLegendItems && (
        <MapStyleSwitcher
          isAerialPhoto={isAerialPhoto}
          setIsAerialPhoto={setIsAerialPhoto}
          bottomLeft
          mobile={mobile}
        />
      )}

      <div
        className={`map-location-group${mobile ? ' map-location-group--mobile' : ''}`}
      >
        {children}
        {mobile && hasLegendItems && styleSwitcher}
      </div>

      {mobile && mobileAssetListControl && (
        <div className="map-mobile-asset-controls">
          {mobileAssetListControl}
          {legendButton}
        </div>
      )}

      {map && (
        <div className={`map-zoom-button-group${mobile ? ' mobile' : ''}`}>
          {mobileCurrentLocationControl}
          <MapAttribution
            attribution={getMapAttribution(config, isAerialPhoto)}
            inline
            mobile={mobile}
            purpose={mobile ? 'subtle' : undefined}
          />
          <Button
            purpose={mobile ? 'subtle' : undefined}
            className={
              mobile ? 'map-icon-button' : 'map-button map-zoom-button'
            }
            onClick={() => map.zoomIn()}
            iconOnly
            iconStart={<IconPlus />}
            label={t('map_zoom-in_button_label')}
          />
          <Button
            purpose={mobile ? 'subtle' : undefined}
            className={
              mobile ? 'map-icon-button' : 'map-button map-zoom-button'
            }
            onClick={() => map.zoomOut()}
            iconOnly
            iconStart={<IconMinus />}
            label={t('map_zoom-out_button_label')}
          />
        </div>
      )}

      {!mobile && hasLegendItems && (
        <div className="map-bottom-left-controls">
          {legendButton}
          {styleSwitcher}
        </div>
      )}
    </>
  )
}
